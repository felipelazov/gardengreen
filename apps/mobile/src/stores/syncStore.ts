import { create } from 'zustand';

type SyncStatus = 'idle' | 'syncing' | 'error' | 'completed';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  pendingUploads: number;
  syncStatus: SyncStatus;

  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setSyncCompleted: () => void;
  setSyncError: () => void;
  setPendingUploads: (count: number) => void;
}

export const useSyncStore = create<SyncState>()((set) => ({
  isOnline: true,
  isSyncing: false,
  lastSyncAt: null,
  pendingUploads: 0,
  syncStatus: 'idle',

  setOnline: (isOnline) => set({ isOnline }),

  setSyncing: (isSyncing) =>
    set({ isSyncing, syncStatus: isSyncing ? 'syncing' : 'idle' }),

  setSyncCompleted: () =>
    set({
      isSyncing: false,
      syncStatus: 'completed',
      lastSyncAt: new Date().toISOString(),
    }),

  setSyncError: () =>
    set({ isSyncing: false, syncStatus: 'error' }),

  setPendingUploads: (pendingUploads) => set({ pendingUploads }),
}));
