import { useRouter } from 'expo-router';
import { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatCurrency } from '@shared/utils/formatCurrency';

export type ServiceStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

interface ServiceCardProps {
  id: string;
  time?: string | null;
  clientName: string;
  type: string;
  value: number;
  status: ServiceStatus;
  onSwipeComplete?: (id: string) => void;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { bg: string; text: string; label: string }
> = {
  scheduled: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Agendado' },
  in_progress: { bg: '#FEF9C3', text: '#92400E', label: 'Em andamento' },
  completed: { bg: '#DCFCE7', text: '#166534', label: 'Concluido' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280', label: 'Cancelado' },
};

export function ServiceCard({
  id,
  time,
  clientName,
  type,
  value,
  status,
  onSwipeComplete,
}: ServiceCardProps) {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.scheduled;
  const isCompleted = status === 'completed';

  const handlePress = () => {
    router.push(`/(tabs)/agenda/${id}`);
  };

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Coluna de horario */}
        <View style={styles.timeCol}>
          {time ? (
            <>
              <Text style={styles.timeText}>{time}</Text>
            </>
          ) : (
            <Text style={styles.noTime}>—</Text>
          )}
        </View>

        {/* Divisor */}
        <View style={[styles.divider, { backgroundColor: statusCfg.bg }]} />

        {/* Conteudo principal */}
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.clientName} numberOfLines={1}>
              {clientName}
            </Text>
            <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
              <Text style={[styles.badgeText, { color: statusCfg.text }]}>
                {statusCfg.label}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.serviceType} numberOfLines={1}>
              {type}
            </Text>
            <Text style={styles.value}>{formatCurrency(value)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
    minHeight: 70,
  },
  cardCompleted: {
    opacity: 0.55,
  },
  timeCol: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  noTime: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  divider: {
    width: 4,
    borderRadius: 2,
    marginVertical: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  serviceType: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
