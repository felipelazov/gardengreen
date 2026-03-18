import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { syncDatabase } from '@/database/sync/syncAdapter';
import { useSyncStore } from '@/stores/syncStore';

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function useAutoSync() {
  const { setOnline, setSyncing, setSyncCompleted, setSyncError } =
    useSyncStore();

  const performSync = async () => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    setSyncing(true);
    try {
      await syncDatabase();
      setSyncCompleted();
    } catch (error) {
      console.warn('Sync failed:', error);
      setSyncError();
    }
  };

  useEffect(() => {
    // Trigger 1: App comes to foreground
    const appStateSubscription = AppState.addEventListener(
      'change',
      (state) => {
        if (state === 'active') {
          performSync();
        }
      },
    );

    // Trigger 2: Connection restored
    const netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
      if (state.isConnected) {
        performSync();
      }
    });

    // Trigger 3: Periodic sync every 5 minutes
    const interval = setInterval(performSync, SYNC_INTERVAL_MS);

    // Initial sync
    performSync();

    return () => {
      appStateSubscription.remove();
      netInfoUnsubscribe();
      clearInterval(interval);
    };
  }, []);
}
