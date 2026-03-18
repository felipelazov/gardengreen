import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Q } from '@nozbe/watermelondb';

import { supabase } from '@shared/lib/supabase';
import { database } from '@/database';
import { PhotoModel } from '@/database/models/Photo';
import { useSyncStore } from '@/stores/syncStore';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB
const MAX_DIMENSION = 1080;
const JPEG_QUALITY = 0.8;
const STORAGE_BUCKET = 'garden-photos';
const LOCAL_PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

/** Backoff delays in ms: immediate → 5 min → 15 min → 60 min */
const BACKOFF_MS = [0, 5 * 60_000, 15 * 60_000, 60 * 60_000];

// ─── Types ───────────────────────────────────────────────────────────────────

export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

export interface CompressResult {
  uri: string;
  width: number;
  height: number;
  fileSize: number;
}

export interface SavePhotoParams {
  serviceId: string;
  clientId: string;
  userId: string;
  type: 'before' | 'after';
  localPath: string;
  fileSize: number;
}

// ─── Directory helpers ────────────────────────────────────────────────────────

async function ensurePhotosDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(LOCAL_PHOTOS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(LOCAL_PHOTOS_DIR, { intermediates: true });
  }
}

// ─── Image compression ────────────────────────────────────────────────────────

/**
 * Compresses an image to fit within MAX_DIMENSION × MAX_DIMENSION at JPEG_QUALITY.
 * If the file is already ≤ MAX_FILE_SIZE the original uri is returned as-is
 * (still converted to JPEG to normalise format).
 */
export async function compressImage(uri: string): Promise<CompressResult> {
  // Check current file size first
  const originalInfo = await FileSystem.getInfoAsync(uri, { size: true });
  const originalSize = originalInfo.exists ? (originalInfo as FileSystem.FileInfo & { size: number }).size ?? 0 : 0;

  // If already within limits, still normalise to JPEG but skip resize
  const actions: ImageManipulator.Action[] =
    originalSize > MAX_FILE_SIZE ? [{ resize: { width: MAX_DIMENSION } }] : [];

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  const compressedInfo = await FileSystem.getInfoAsync(result.uri, { size: true });
  const fileSize = compressedInfo.exists
    ? (compressedInfo as FileSystem.FileInfo & { size: number }).size ?? 0
    : 0;

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
    fileSize,
  };
}

// ─── Local persistence ────────────────────────────────────────────────────────

/**
 * Saves a photo record to WatermelonDB with upload_status = 'pending'.
 * The file must already exist at `params.localPath`.
 */
export async function savePhotoLocally(params: SavePhotoParams): Promise<PhotoModel> {
  return database.write(async () => {
    return database.get<PhotoModel>('photos').create((photo) => {
      photo.serviceId = params.serviceId;
      photo.clientId = params.clientId;
      photo.userId = params.userId;
      photo.type = params.type;
      photo.localPath = params.localPath;
      photo.fileSize = params.fileSize;
      photo.uploadStatus = 'pending';
      photo.url = null;
    });
  });
}

// ─── Upload helpers ───────────────────────────────────────────────────────────

/**
 * Decodes a Base64 string to a Uint8Array for Supabase Storage upload.
 */
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Uploads a single PhotoModel record to Supabase Storage.
 * Manages upload_status transitions: pending → uploading → uploaded | failed.
 * Throws on upload error (caller decides retry strategy).
 */
export async function uploadSinglePhoto(photo: PhotoModel): Promise<void> {
  if (!photo.localPath) {
    throw new Error(`Photo ${photo.id} has no local_path`);
  }

  // Mark as uploading
  await database.write(async () => {
    await photo.update((p) => {
      p.uploadStatus = 'uploading';
    });
  });

  const storagePath = `${photo.userId}/${photo.clientId}/${photo.serviceId}/${photo.id}.jpg`;

  let uploadError: Error | null = null;

  try {
    await ensurePhotosDir();

    const base64 = await FileSystem.readAsStringAsync(photo.localPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const bytes = base64ToBytes(base64);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, { contentType: 'image/jpeg', upsert: true });

    if (error) {
      uploadError = new Error(error.message);
    }
  } catch (err) {
    uploadError = err instanceof Error ? err : new Error(String(err));
  }

  if (uploadError) {
    await database.write(async () => {
      await photo.update((p) => {
        p.uploadStatus = 'failed';
      });
    });
    throw uploadError;
  }

  // Success — persist public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  await database.write(async () => {
    await photo.update((p) => {
      p.uploadStatus = 'uploaded';
      p.url = urlData.publicUrl;
    });
  });
}

// ─── Upload queue ─────────────────────────────────────────────────────────────

/**
 * Processes all photos with upload_status = 'pending' or 'failed' (if retryFailed is true).
 * Uploads are performed serially to avoid saturating mobile connections.
 * Updates syncStore.pendingUploads after each upload.
 */
export async function uploadPendingPhotos(
  options: { retryFailed?: boolean } = {},
): Promise<void> {
  const { retryFailed = false } = options;

  const statusFilter = retryFailed
    ? Q.or(Q.where('upload_status', 'pending'), Q.where('upload_status', 'failed'))
    : Q.where('upload_status', 'pending');

  const pendingPhotos = await database
    .get<PhotoModel>('photos')
    .query(statusFilter)
    .fetch();

  const setPendingUploads = useSyncStore.getState().setPendingUploads;
  setPendingUploads(pendingPhotos.length);

  let remaining = pendingPhotos.length;

  for (const photo of pendingPhotos) {
    try {
      await uploadSinglePhoto(photo);
    } catch (error) {
      console.warn(`[photoService] Upload failed for photo ${photo.id}:`, error);
      // Continue with remaining photos; failed status is already set on the record
    } finally {
      remaining -= 1;
      setPendingUploads(remaining);
    }
  }
}

/**
 * Returns the backoff delay in ms for a given retry attempt (0-indexed).
 */
export function getBackoffDelay(attempt: number): number {
  const index = Math.min(attempt, BACKOFF_MS.length - 1);
  return BACKOFF_MS[index];
}

/**
 * Counts photos by upload status.
 */
export async function countPhotosByStatus(status: UploadStatus): Promise<number> {
  const photos = await database
    .get<PhotoModel>('photos')
    .query(Q.where('upload_status', status))
    .fetch();
  return photos.length;
}
