import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentCardData {
  id: string;
  clientName: string;
  serviceDate: string; // YYYY-MM-DD
  amount: number;
  createdAt: Date;
}

interface PaymentCardProps {
  payment: PaymentCardData;
  onPressPix: (paymentId: string) => void;
  onPressPaid: (paymentId: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function daysPending(createdAt: Date): number {
  const today = new Date();
  const diff = today.getTime() - createdAt.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaymentCard({ payment, onPressPix, onPressPaid }: PaymentCardProps) {
  const days = daysPending(payment.createdAt);

  const daysLabel =
    days === 0
      ? 'Hoje'
      : days === 1
        ? '1 dia pendente'
        : `${days} dias pendente`;

  const daysColor = days >= 7 ? '#DC2626' : days >= 3 ? '#D97706' : '#6B7280';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.clientName} numberOfLines={1}>
          {payment.clientName}
        </Text>
        <Text style={styles.amount}>{formatBRL(payment.amount)}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.serviceDate}>Servico em {formatDate(payment.serviceDate)}</Text>
        <Text style={[styles.daysPending, { color: daysColor }]}>{daysLabel}</Text>
      </View>

      {/* Status indicator */}
      <View style={styles.statusDot} />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPix}
          onPress={() => onPressPix(payment.id)}
          activeOpacity={0.7}
          accessibilityLabel={`Cobrar PIX de ${payment.clientName}`}
        >
          <Text style={styles.btnPixText}>Cobrar PIX</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnPaid}
          onPress={() => onPressPaid(payment.id)}
          activeOpacity={0.7}
          accessibilityLabel={`Marcar pago de ${payment.clientName}`}
        >
          <Text style={styles.btnPaidText}>Marcar pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  statusDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
    marginBottom: 14,
  },
  serviceDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  daysPending: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 8,
  },
  btnPix: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  btnPixText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  btnPaid: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minHeight: 40,
    justifyContent: 'center',
  },
  btnPaidText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
});
