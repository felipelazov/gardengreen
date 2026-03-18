import { useEffect, useRef } from 'react';

import { syncDatabase } from '@/database/sync/syncAdapter';
import { useSyncStore } from '@/stores/syncStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@shared/lib/supabase';

type RealtimeChannel = ReturnType<typeof supabase.channel>;

const REALTIME_TABLES = ['services', 'payments', 'clients'] as const;

export function useRealtimeSync() {
  const { setSyncing, setSyncCompleted, setSyncError } = useSyncStore();
  const user = useAuthStore((s) => s.user);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const performSync = async () => {
    setSyncing(true);
    try {
      await syncDatabase();
      setSyncCompleted();
    } catch (error) {
      console.warn('[useRealtimeSync] Sync triggered by realtime failed:', error);
      setSyncError();
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const userId = user.id;

    // Subscribe one channel per table, filtered by user_id
    const newChannels = REALTIME_TABLES.map((table) => {
      const channel = supabase
        .channel(`${table}:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter: `user_id=eq.${userId}`,
          },
          (_payload) => {
            // A server-side change was detected — trigger a full sync so
            // WatermelonDB reconciles local state with the server.
            performSync();
          },
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[useRealtimeSync] Subscribed to ${table}:${userId}`);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.warn(`[useRealtimeSync] Channel ${table}:${userId} status: ${status}`);
          }
        });

      return channel;
    });

    channelsRef.current = newChannels;

    return () => {
      channelsRef.current.forEach((ch) => {
        supabase.removeChannel(ch);
      });
      channelsRef.current = [];
    };
    // performSync is intentionally excluded — it is a stable async function
    // recreated per render but does not depend on any state that would change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
}
