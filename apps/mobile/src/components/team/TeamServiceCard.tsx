import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { formatCurrency } from '@shared/utils/formatCurrency';

import { getMemberColor } from './MemberCard';

export interface TeamServiceCardProps {
  id: string;
  time?: string | null;
  clientName: string;
  type: string;
  value: number;
  status: string;
  assignedMemberName?: string | null;
  memberColorIndex?: number | null;
  onPress?: (id: string) => void;
  onAssignPress?: (id: string) => void;
  isAdmin?: boolean;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Agendado' },
  in_progress: { bg: '#FEF9C3', text: '#92400E', label: 'Em andamento' },
  completed: { bg: '#DCFCE7', text: '#166534', label: 'Concluido' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280', label: 'Cancelado' },
};

const UNASSIGNED_COLOR = '#DC2626';

export function TeamServiceCard({
  id,
  time,
  clientName,
  type,
  value,
  status,
  assignedMemberName,
  memberColorIndex,
  onPress,
  onAssignPress,
  isAdmin = false,
}: TeamServiceCardProps) {
  const isUnassigned = !assignedMemberName;
  const borderColor =
    isUnassigned
      ? UNASSIGNED_COLOR
      : memberColorIndex != null
        ? getMemberColor(memberColorIndex)
        : '#16A34A';

  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['scheduled']!;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={() => onPress?.(id)}
      activeOpacity={0.8}
    >
      {/* Coluna de horario */}
      <View style={styles.timeCol}>
        {time ? (
          <Text style={styles.timeText}>{time}</Text>
        ) : (
          <Text style={styles.noTime}>—</Text>
        )}
      </View>

      {/* Conteudo */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.clientName} numberOfLines={1}>
            {clientName}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.badgeText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.serviceType} numberOfLines={1}>
            {type}
          </Text>
          <Text style={styles.value}>{formatCurrency(value)}</Text>
        </View>

        {/* Membro atribuido ou label sem atribuicao */}
        <View style={styles.memberRow}>
          <View
            style={[
              styles.memberDot,
              { backgroundColor: isUnassigned ? UNASSIGNED_COLOR : borderColor },
            ]}
          />
          <Text
            style={[
              styles.memberLabel,
              { color: isUnassigned ? UNASSIGNED_COLOR : '#6B7280' },
            ]}
            numberOfLines={1}
          >
            {isUnassigned ? 'Sem atribuicao' : assignedMemberName}
          </Text>

          {isAdmin && (
            <TouchableOpacity
              onPress={() => onAssignPress?.(id)}
              style={styles.assignButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.assignButtonText}>
                {isUnassigned ? 'Atribuir' : 'Reatribuir'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    minHeight: 80,
    borderLeftWidth: 4,
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
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    gap: 3,
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
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
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  memberLabel: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  assignButton: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  assignButtonText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '600',
  },
});
