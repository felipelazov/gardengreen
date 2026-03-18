import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';

import { useSyncStore } from '@/stores/syncStore';

export function useNetwork() {
  const setOnline = useSyncStore((s) => s.setOnline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });

    return () => unsubscribe();
  }, [setOnline]);
}
