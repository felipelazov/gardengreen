import { Text, View } from 'react-native';

import { useSyncStore } from '@/stores/syncStore';

export function OfflineBadge() {
  const { isOnline, isSyncing, syncStatus } = useSyncStore();

  if (isOnline && syncStatus !== 'syncing') return null;

  const config = getConfig(isOnline, isSyncing);

  return (
    <View
      style={{
        backgroundColor: config.bg,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: config.text, fontSize: 12, fontWeight: '600' }}>
        {config.label}
      </Text>
    </View>
  );
}

function getConfig(isOnline: boolean, isSyncing: boolean) {
  if (!isOnline) {
    return { bg: '#FEF3C7', text: '#92400E', label: 'Modo offline' };
  }
  if (isSyncing) {
    return { bg: '#DBEAFE', text: '#1E40AF', label: 'Sincronizando...' };
  }
  return { bg: '#DCFCE7', text: '#166534', label: 'Dados sincronizados' };
}
