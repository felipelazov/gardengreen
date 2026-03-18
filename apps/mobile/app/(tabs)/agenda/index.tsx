import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ServiceCard } from '@/components/agenda/ServiceCard';
import { Snackbar } from '@/components/common/Snackbar';
import { ClientModel } from '@/database/models/Client';
import { ServiceModel } from '@/database/models/Service';
import { useCancelService, useCompleteService, useTodayServices } from '@/hooks/useServices';
import { useAuthStore } from '@/stores/authStore';
import { formatHeaderDate, getTodayStr } from '@shared/utils/formatDate';

const PRIMARY = '#16A34A';

export default function AgendaIndex() {
  const router = useRouter();
  const database = useDatabase();
  const { user } = useAuthStore();
  const userId = user?.id ?? '';
  const today = getTodayStr();

  const { services, loading, refetch } = useTodayServices(userId);
  const { completeService } = useCompleteService();
  const { cancelService } = useCancelService();

  const [clientMap, setClientMap] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    onUndo?: () => void;
  }>({ visible: false, message: '' });

  // Carrega nomes dos clientes
  const loadClients = useCallback(async () => {
    if (!services.length) return;
    const clientIds = [...new Set(services.map((s) => s.clientId))];
    const clients = await database
      .get<ClientModel>('clients')
      .query(Q.where('id', Q.oneOf(clientIds)))
      .fetch();
    const map: Record<string, string> = {};
    clients.forEach((c) => (map[c.id] = c.name));
    setClientMap(map);
  }, [services, database]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleComplete = useCallback(
    async (serviceId: string) => {
      await completeService(serviceId);
      setSnackbar({
        visible: true,
        message: 'Servico marcado como concluido',
        onUndo: undefined,
      });
      refetch();
    },
    [completeService, refetch],
  );

  const headerDate = formatHeaderDate(today);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hoje</Text>
          <Text style={styles.headerDate}>{headerDate}</Text>
        </View>
        <TouchableOpacity
          style={styles.weekBtn}
          onPress={() => router.push('/(tabs)/agenda/week')}
        >
          <Text style={styles.weekBtnText}>Ver semana</Text>
        </TouchableOpacity>
      </View>

      {/* Contador */}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {services.length === 0
              ? 'Nenhum servico'
              : `${services.length} servico${services.length > 1 ? 's' : ''}`}
          </Text>
        </View>
      )}

      {/* Lista */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              id={item.id}
              time={item.time}
              clientName={clientMap[item.clientId] ?? '...'}
              type={item.type}
              value={item.value}
              status={item.status as any}
              onSwipeComplete={handleComplete}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PRIMARY}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>
                Nenhum servico agendado para hoje
              </Text>
              <Text style={styles.emptySubtitle}>
                Toque no + para adicionar um servico
              </Text>
            </View>
          }
          contentContainerStyle={
            services.length === 0 ? styles.emptyContainer : styles.listContent
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/agenda/new')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        onUndo={snackbar.onUndo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  headerDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  weekBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  weekBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },
  countRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
  },
});
