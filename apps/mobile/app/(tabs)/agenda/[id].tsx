import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Snackbar } from '@/components/common/Snackbar';
import { ClientModel } from '@/database/models/Client';
import { ServiceModel } from '@/database/models/Service';
import {
  useCancelService,
  useCompleteService,
  useRescheduleService,
} from '@/hooks/useServices';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { formatDateBR, formatHeaderDate } from '@shared/utils/formatDate';

const PRIMARY = '#16A34A';

type ServiceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

const STATUS_LABELS: Record<ServiceStatus, string> = {
  scheduled: 'Agendado',
  in_progress: 'Em andamento',
  completed: 'Concluido',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<ServiceStatus, { bg: string; text: string }> = {
  scheduled: { bg: '#DBEAFE', text: '#1D4ED8' },
  in_progress: { bg: '#FEF9C3', text: '#92400E' },
  completed: { bg: '#DCFCE7', text: '#166534' },
  cancelled: { bg: '#F3F4F6', text: '#6B7280' },
};

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const database = useDatabase();

  const { completeService, loading: completing } = useCompleteService();
  const { cancelService, loading: cancelling } = useCancelService();
  const { rescheduleService, loading: rescheduling } = useRescheduleService();

  const [service, setService] = useState<ServiceModel | null>(null);
  const [client, setClient] = useState<ClientModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const loadService = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const s = await database.get<ServiceModel>('services').find(id);
      setService(s);
      setNewDate(s.date);
      setNewTime(s.time ?? '');
      const c = await database.get<ClientModel>('clients').find(s.clientId);
      setClient(c);
    } catch (err) {
      console.error('Error loading service:', err);
    } finally {
      setLoading(false);
    }
  }, [id, database]);

  useEffect(() => {
    loadService();
  }, [loadService]);

  const handleComplete = async () => {
    if (!id) return;
    Alert.alert('Concluir servico', 'Marcar este servico como concluido?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        style: 'default',
        onPress: async () => {
          await completeService(id);
          setSnackbar({ visible: true, message: 'Servico concluido!' });
          loadService();
        },
      },
    ]);
  };

  const handleCancel = async () => {
    if (!id) return;
    Alert.alert('Cancelar servico', 'Tem certeza que deseja cancelar?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar servico',
        style: 'destructive',
        onPress: async () => {
          await cancelService(id);
          setSnackbar({ visible: true, message: 'Servico cancelado' });
          loadService();
        },
      },
    ]);
  };

  const handleReschedule = async () => {
    if (!id) return;
    if (!newDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Data invalida', 'Informe a data no formato AAAA-MM-DD');
      return;
    }
    await rescheduleService(id, newDate, newTime || null);
    setShowReschedule(false);
    setSnackbar({ visible: true, message: 'Servico reagendado!' });
    loadService();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#6B7280' }}>Servico nao encontrado</Text>
      </View>
    );
  }

  const status = service.status as ServiceStatus;
  const statusCfg = STATUS_COLORS[status] ?? STATUS_COLORS.scheduled;
  const isActive = status === 'scheduled' || status === 'in_progress';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card principal */}
        <View style={styles.card}>
          {/* Status badge */}
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: statusCfg.bg }]}>
              <Text style={[styles.badgeText, { color: statusCfg.text }]}>
                {STATUS_LABELS[status]}
              </Text>
            </View>
            {service.time && (
              <Text style={styles.time}>{service.time}</Text>
            )}
          </View>

          {/* Cliente */}
          {client && (
            <TouchableOpacity
              style={styles.clientRow}
              onPress={() => router.push(`/(tabs)/clients/${client.id}` as any)}
            >
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>
                  {client.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientName}>{client.name}</Text>
                {client.phone && (
                  <Text style={styles.clientPhone}>{client.phone}</Text>
                )}
              </View>
              <Text style={styles.clientArrow}>{'>'}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.separator} />

          {/* Informacoes do servico */}
          <InfoRow label="Data" value={formatDateBR(service.date)} />
          <InfoRow label="Tipo" value={service.type} />
          <InfoRow label="Valor" value={formatCurrency(service.value)} highlight />
          {service.description && (
            <InfoRow label="Descricao" value={service.description} />
          )}
          {service.notes && (
            <InfoRow label="Observacoes" value={service.notes} />
          )}
          {service.completedAt && (
            <InfoRow
              label="Concluido em"
              value={new Date(service.completedAt).toLocaleString('pt-BR')}
            />
          )}
        </View>

        {/* Reagendamento inline */}
        {showReschedule && isActive && (
          <View style={styles.rescheduleCard}>
            <Text style={styles.sectionTitle}>Reagendar servico</Text>
            <View style={styles.rescheduleRow}>
              <View style={{ flex: 2 }}>
                <Text style={styles.inputLabel}>Nova data</Text>
                <TextInput
                  style={styles.input}
                  value={newDate}
                  onChangeText={setNewDate}
                  placeholder="AAAA-MM-DD"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Horario</Text>
                <TextInput
                  style={styles.input}
                  value={newTime}
                  onChangeText={setNewTime}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>
            <View style={styles.rescheduleButtons}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setShowReschedule(false)}
              >
                <Text style={styles.outlineBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleReschedule}
                disabled={rescheduling}
              >
                <Text style={styles.confirmBtnText}>
                  {rescheduling ? 'Salvando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Acoes */}
        {isActive && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Acoes</Text>
            <TouchableOpacity
              style={[styles.actionBtn, styles.completeBtn]}
              onPress={handleComplete}
              disabled={completing}
            >
              <Text style={styles.completeBtnText}>
                {completing ? 'Processando...' : 'Concluir servico'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.rescheduleBtn]}
              onPress={() => setShowReschedule(!showReschedule)}
            >
              <Text style={styles.rescheduleBtnText}>Reagendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={handleCancel}
              disabled={cancelling}
            >
              <Text style={styles.cancelBtnText}>
                {cancelling ? 'Cancelando...' : 'Cancelar servico'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
      />
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  time: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  clientPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  clientArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  infoValueHighlight: {
    color: PRIMARY,
    fontSize: 16,
  },
  rescheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  rescheduleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  rescheduleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeBtn: {
    backgroundColor: PRIMARY,
  },
  completeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rescheduleBtn: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  rescheduleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});
