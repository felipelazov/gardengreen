import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { countPhotosByStatus, getBackoffDelay, uploadPendingPhotos } from '@/services/photoService';
import { useSyncStore } from '@/stores/syncStore';

// ─── Constants ────────────────────────────────────────────────────────────────

/** How often to refresh the pending count when the app is in the foreground (ms). */
const PENDING_COUNT_REFRESH_MS = 30_000;

/** Maximum consecutive failures before we stop retrying automatically. */
const MAX_AUTO_RETRIES = 3;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages background photo uploads.
 *
 * Responsibilities:
 * - Watches for network connection restore and triggers the upload queue
 * - Retries failed photos with exponential backoff (up to MAX_AUTO_RETRIES)
 * - Keeps `syncStore.pendingUploads` up-to-date
 * - Coordinates with the existing useAutoSync pattern (does NOT duplicate
 *   the data sync — only handles photo uploads)
 *
 * Mount this hook once at the authenticated root layout, alongside useAutoSync.
 */
export function usePhotoUpload() {
  const setPendingUploads = useSyncStore((s) => s.setPendingUploads);
  const isOnline = useSyncStore((s) => s.isOnline);

  /** Tracks how many consecutive upload attempts have failed. */
  const failureCountRef = useRef(0);
  /** Tracks the id of the pending backoff timer so we can cancel it. */
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Prevents overlapping upload runs. */
  const isRunningRef = useRef(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const refreshPendingCount = async () => {
    try {
      const pending = await countPhotosByStatus('pending');
      const failed = await countPhotosByStatus('failed');
      setPendingUploads(pending + failed);
    } catch {
      // non-critical — ignore
    }
  };

  const clearRetryTimer = () => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const runUploadQueue = async (retryFailed = false) => {
    if (isRunningRef.current) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    isRunningRef.current = true;
    clearRetryTimer();

    try {
      await uploadPendingPhotos({ retryFailed });
      // Success — reset failure counter
      failureCountRef.current = 0;
      await refreshPendingCount();
    } catch (error) {
      console.warn('[usePhotoUpload] Upload queue run failed:', error);
      failureCountRef.current += 1;

      const attempt = failureCountRef.current;

      if (attempt <= MAX_AUTO_RETRIES) {
        const delayMs = getBackoffDelay(attempt);
        console.info(
          `[usePhotoUpload] Scheduling retry #${attempt} in ${delayMs / 1000}s`,
        );
        retryTimerRef.current = setTimeout(() => {
          runUploadQueue(true);
        }, delayMs);
      } else {
        console.warn(
          `[usePhotoUpload] Max retries (${MAX_AUTO_RETRIES}) reached. ` +
            'Upload paused until next connection restore or foreground event.',
        );
        // Reset so the next trigger (connection restore, foreground) tries again
        failureCountRef.current = 0;
      }
    } finally {
      isRunningRef.current = false;
    }
  };

  // ── Triggers ───────────────────────────────────────────────────────────────

  useEffect(() => {
    // Trigger 1: Network connection restored
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        runUploadQueue(true); // also retry previously failed photos
      }
    });

    // Trigger 2: App comes to foreground
    const appStateSubscription = AppState.addEventListener('change', (appState) => {
      if (appState === 'active') {
        runUploadQueue(false);
      }
    });

    // Trigger 3: Periodic pending count refresh (no upload — just count update)
    const countRefreshInterval = setInterval(
      refreshPendingCount,
      PENDING_COUNT_REFRESH_MS,
    );

    // Initial run when hook mounts (e.g. after login)
    runUploadQueue(true);

    return () => {
      netInfoUnsubscribe();
      appStateSubscription.remove();
      clearInterval(countRefreshInterval);
      clearRetryTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-trigger when isOnline flips to true (store-driven, e.g. from useNetwork)
  useEffect(() => {
    if (isOnline) {
      runUploadQueue(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);
}
