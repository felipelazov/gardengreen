import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useMarkPaid } from '@/hooks/usePayments';
import type { ManualPaymentMethod } from '@/hooks/usePayments';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ManualPaymentModalProps {
  visible: boolean;
  paymentId: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

interface MethodOption {
  value: ManualPaymentMethod;
  label: string;
  emoji: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAYMENT_METHODS: MethodOption[] = [
  { value: 'cash', label: 'Dinheiro', emoji: '💵' },
  { value: 'pix_direct', label: 'PIX direto', emoji: '⚡' },
  { value: 'transfer', label: 'Transferencia', emoji: '🏦' },
  { value: 'other', label: 'Outro', emoji: '•••' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ManualPaymentModal({
  visible,
  paymentId,
  onSuccess,
  onClose,
}: ManualPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<ManualPaymentMethod | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { markPaid, loading } = useMarkPaid();

  const handleConfirm = async () => {
    if (!selectedMethod) {
      setValidationError('Selecione o metodo de pagamento');
      return;
    }

    if (!paymentId) return;

    setValidationError(null);
    try {
      await markPaid(paymentId, selectedMethod);
      setSelectedMethod(null);
      onSuccess();
      onClose();
    } catch {
      setValidationError('Nao foi possivel registrar o pagamento. Tente novamente.');
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSelectedMethod(null);
    setValidationError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <Text style={styles.title}>Como foi recebido?</Text>
          <Text style={styles.subtitle}>Selecione o metodo de pagamento</Text>

          {/* Method options */}
          <View style={styles.methodsGrid}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.value;
              return (
                <TouchableOpacity
                  key={method.value}
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                  onPress={() => {
                    setSelectedMethod(method.value);
                    setValidationError(null);
                  }}
                  activeOpacity={0.7}
                  accessibilityLabel={`Metodo ${method.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.methodEmoji}>{method.emoji}</Text>
                  <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                    {method.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Validation error */}
          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}

          {/* Actions */}
          <TouchableOpacity
            style={[
              styles.btnConfirm,
              (!selectedMethod || loading) && styles.btnConfirmDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedMethod || loading}
            activeOpacity={0.8}
            accessibilityLabel="Confirmar pagamento"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.btnConfirmText}>Confirmar pagamento</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancel}
            onPress={handleClose}
            disabled={loading}
            activeOpacity={0.7}
            accessibilityLabel="Cancelar"
          >
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  methodCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 80,
  },
  methodCardSelected: {
    borderColor: '#16A34A',
    backgroundColor: '#F0FDF4',
  },
  methodEmoji: {
    fontSize: 24,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  methodLabelSelected: {
    color: '#16A34A',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  btnConfirm: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56,
    justifyContent: 'center',
  },
  btnConfirmDisabled: {
    backgroundColor: '#D1FAE5',
  },
  btnConfirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  btnCancel: {
    paddingVertical: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  btnCancelText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 15,
  },
});
