import { TouchableOpacity, View, Text } from 'react-native';

import type { ClientModel } from '@/database/models/Client';

interface ClientCardProps {
  client: ClientModel;
  onPress: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#DCFCE7', text: '#15803D', label: 'Ativo' },
  inactive: { bg: '#F3F4F6', text: '#6B7280', label: 'Inativo' },
  pending_payment: { bg: '#FEF9C3', text: '#A16207', label: 'Pendente' },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_COLORS[status] ?? STATUS_COLORS['active'];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '600', color: config.text }}>{config.label}</Text>
    </View>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ClientCard({ client, onPress }: ClientCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: '#DCFCE7',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 14,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#15803D' }}>
          {getInitials(client.name)}
        </Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 3 }}
          numberOfLines={1}
        >
          {client.name}
        </Text>
        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 6 }} numberOfLines={1}>
          {client.phone}
          {client.city ? `  •  ${client.city}` : ''}
        </Text>
        <StatusBadge status={client.status} />
      </View>

      {/* Chevron */}
      <Text style={{ fontSize: 20, color: '#9CA3AF', marginLeft: 8 }}>›</Text>
    </TouchableOpacity>
  );
}
