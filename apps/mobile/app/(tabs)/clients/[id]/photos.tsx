import { Q } from '@nozbe/watermelondb';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { database } from '@/database';
import type { PhotoModel } from '@/database/models/Photo';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = (SCREEN_WIDTH - 16 * 2 - 8) / 2;

// ─── Upload status indicator ───────────────────────────────────────────────────

function UploadStatusDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    uploaded: { color: '#16A34A', label: '✓' },
    pending: { color: '#F59E0B', label: '↑' },
    failed: { color: '#DC2626', label: '!' },
    uploading: { color: '#3B82F6', label: '…' },
  };
  const s = config[status] ?? config['pending'];

  return (
    <View
      style={{
        position: 'absolute',
        top: 6,
        right: 6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: s.color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '700' }}>{s.label}</Text>
    </View>
  );
}

// ─── Type badge ────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const isAfter = type === 'after';
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: isAfter ? '#16A34A' : '#6B7280',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '700' }}>
        {isAfter ? 'DEPOIS' : 'ANTES'}
      </Text>
    </View>
  );
}

// ─── Photo Thumbnail ───────────────────────────────────────────────────────────

function PhotoThumbnail({ photo, onPress }: { photo: PhotoModel; onPress: () => void }) {
  const uri = photo.url ?? photo.localPath ?? null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
        marginBottom: 8,
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 28 }}>🌿</Text>
        </View>
      )}
      <UploadStatusDot status={photo.uploadStatus} />
      {(photo.type === 'before' || photo.type === 'after') && (
        <TypeBadge type={photo.type} />
      )}
    </TouchableOpacity>
  );
}

// ─── Fullscreen viewer ─────────────────────────────────────────────────────────

function FullscreenViewer({
  photos,
  initialIndex,
  onClose,
}: {
  photos: PhotoModel[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const photo = photos[currentIndex];
  const uri = photo?.url ?? photo?.localPath ?? null;

  return (
    <Modal visible animationType="fade" statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: '#FFFFFF' }}>✕</Text>
        </TouchableOpacity>

        {/* Counter */}
        <View
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 13 }}>
            {currentIndex + 1} / {photos.length}
          </Text>
        </View>

        {/* Image */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {uri ? (
            <Image
              source={{ uri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ fontSize: 60 }}>🌿</Text>
          )}
        </View>

        {/* Navigation arrows */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 40,
          }}
        >
          <TouchableOpacity
            onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            style={{
              backgroundColor: currentIndex === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
              borderRadius: 10,
              padding: 14,
              minWidth: 56,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 20 }}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentIndex((i) => Math.min(photos.length - 1, i + 1))}
            disabled={currentIndex === photos.length - 1}
            style={{
              backgroundColor:
                currentIndex === photos.length - 1
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(255,255,255,0.3)',
              borderRadius: 10,
              padding: 14,
              minWidth: 56,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Group photos by service date ─────────────────────────────────────────────

interface PhotoGroup {
  date: string;
  photos: PhotoModel[];
}

function groupByDate(photos: PhotoModel[]): PhotoGroup[] {
  const map: Record<string, PhotoModel[]> = {};
  for (const photo of photos) {
    const date = new Date(photo.createdAt).toISOString().split('T')[0];
    if (!map[date]) map[date] = [];
    map[date].push(photo);
  }
  return Object.entries(map)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, photos]) => ({ date, photos }));
}

function formatGroupDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientPhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const collection = database.get<PhotoModel>('photos');
    const query = collection.query(
      Q.where('client_id', id),
      Q.sortBy('created_at', Q.desc),
    );

    const sub = query.observe().subscribe({
      next: (results) => {
        setPhotos(results);
        setLoading(false);
      },
      error: (err) => {
        console.error('[ClientPhotos] observe error:', err);
        setLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, [id]);

  const groups = groupByDate(photos);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18, color: '#16A34A' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '700',
            color: '#14532D',
          }}
        >
          Fotos
        </Text>
        <View style={{ width: 72 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : photos.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📸</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>Nenhuma foto ainda</Text>
          <Text
            style={{ fontSize: 14, color: '#9CA3AF', marginTop: 6, textAlign: 'center', paddingHorizontal: 40 }}
          >
            As fotos dos servicos realizados aparecerao aqui
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <View key={group.date} style={{ marginBottom: 24 }}>
              {/* Date header */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#6B7280',
                  marginBottom: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {formatGroupDate(group.date)}
              </Text>

              {/* Photo grid */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {group.photos.map((photo, idx) => {
                  const globalIndex = photos.indexOf(photo);
                  return (
                    <PhotoThumbnail
                      key={photo.id}
                      photo={photo}
                      onPress={() => setViewerIndex(globalIndex)}
                    />
                  );
                })}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Fullscreen viewer */}
      {viewerIndex !== null && (
        <FullscreenViewer
          photos={photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </SafeAreaView>
  );
}
