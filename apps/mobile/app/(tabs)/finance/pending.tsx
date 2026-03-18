import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ManualPaymentModal } from '@/components/finance/ManualPaymentModal';
import { PaymentCard } from '@/components/finance/PaymentCard';
import { PixModal } from '@/components/finance/PixModal';
import { useCreatePixPayment, usePendingPayments, usePendingTotal } from '@/hooks/usePayments';
import type { PaymentCardData } from '@/components/finance/PaymentCard';
import type { PixResponse } from '@/services/pixService';

import { useAuthStore } from '@/stores/authStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function PendingPaymentsScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const { payments, loading, refetch } = usePendingPayments(userId);
  const { total, refetch: refetchTotal } = usePendingTotal(userId);
  const { createPixPayment, loading: pixLoading } = useCreatePixPayment();

  // PIX modal state
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [activePixData, setActivePixData] = useState<PixResponse | null>(null);
  const [activeClientName, setActiveClientName] = useState('');
  const [activePixPaymentId, setActivePixPaymentId] = useState<string | null>(null);

  // Manual payment modal state
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualPaymentId, setManualPaymentId] = useState<string | null>(null);

  // Refresh
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchTotal()]);
    setRefreshing(false);
  }, [refetch, refetchTotal]);

  // Cobrar PIX
  const handlePressPix = useCallback(
    async (paymentId: string) => {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return;

      setActiveClientName('Cliente'); // Sera substituido quando houver join com clients
      setActivePixData(null);
      setPixModalVisible(true);

      try {
        const { pixData } = await createPixPayment(
          userId,
          payment.serviceId,
          payment.clientId,
          payment.amount,
        );
        setActivePixData(pixData);
        setActivePixPaymentId(payment.id);
      } catch (err) {
        setPixModalVisible(false);
        console.error('handlePressPix error:', err);
      }
    },
    [payments, createPixPayment, userId],
  );

  // Marcar pago manualmente
  const handlePressPaid = useCallback((paymentId: string) => {
    setManualPaymentId(paymentId);
    setManualModalVisible(true);
  }, []);

  // Sucesso no pagamento manual
  const handleManualSuccess = useCallback(() => {
    void Promise.all([refetch(), refetchTotal()]);
  }, [refetch, refetchTotal]);

  // Mapear PaymentModel para PaymentCardData
  const paymentCards: PaymentCardData[] = payments.map((p) => ({
    id: p.id,
    clientName: 'Cliente', // Sera resolvido via join em producao
    serviceDate: new Date(p.createdAt).toISOString().split('T')[0],
    amount: p.amount,
    createdAt: p.createdAt,
  }));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Header: total a receber */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Total a receber</Text>
        <Text style={styles.headerTotal}>{formatBRL(total)}</Text>
        {payments.length > 0 && (
          <Text style={styles.headerCount}>
            {payments.length} {payments.length === 1 ? 'cobranca pendente' : 'cobranças pendentes'}
          </Text>
        )}
      </View>

      {/* Lista */}
      <FlatList
        data={paymentCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaymentCard
            payment={item}
            onPressPix={handlePressPix}
            onPressPaid={handlePressPaid}
          />
        )}
        contentContainerStyle={paymentCards.length === 0 ? styles.emptyContainer : styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={handleRefresh}
            tintColor="#16A34A"
            colors={['#16A34A']}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={styles.emptyTitle}>Nenhuma cobranca pendente!</Text>
              <Text style={styles.emptySubtitle}>
                Todos os pagamentos foram recebidos.
              </Text>
            </View>
          ) : null
        }
      />

      {/* PIX Modal */}
      <PixModal
        visible={pixModalVisible && !pixLoading}
        pixData={activePixData}
        clientName={activeClientName}
        onMarkPaid={() => {
          if (activePixPaymentId) {
            setManualPaymentId(activePixPaymentId);
          }
        }}
        onClose={() => {
          setPixModalVisible(false);
          setActivePixData(null);
        }}
      />

      {/* Manual Payment Modal */}
      <ManualPaymentModal
        visible={manualModalVisible}
        paymentId={manualPaymentId}
        onSuccess={handleManualSuccess}
        onClose={() => {
          setManualModalVisible(false);
          setManualPaymentId(null);
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    color: '#BBF7D0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerTotal: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  headerCount: {
    fontSize: 13,
    color: '#D1FAE5',
    marginTop: 4,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
