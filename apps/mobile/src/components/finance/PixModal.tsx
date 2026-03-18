import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Linking } from 'react-native';

import type { PixResponse } from '@/services/pixService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PixModalProps {
  visible: boolean;
  pixData: PixResponse | null;
  clientName: string;
  onMarkPaid: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expirado';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PixModal({ visible, pixData, clientName, onMarkPaid, onClose }: PixModalProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);

  // Inicializar countdown quando pixData mudar
  useEffect(() => {
    if (!pixData?.expires_at) return;
    const expiresAt = new Date(pixData.expires_at).getTime();
    const update = () => setTimeLeft(expiresAt - Date.now());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [pixData?.expires_at]);

  const handleCopyCode = useCallback(() => {
    if (!pixData?.copy_paste) return;
    Clipboard.setString(pixData.copy_paste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [pixData?.copy_paste]);

  const handleWhatsApp = useCallback(() => {
    if (!pixData) return;
    const message = encodeURIComponent(
      `Ola ${clientName}! Segue o link para pagamento via PIX:\n\n${pixData.link}\n\nObrigado!`,
    );
    Linking.openURL(`whatsapp://send?text=${message}`).catch(() => {
      Alert.alert('Erro', 'WhatsApp nao encontrado. Copie o link manualmente.');
    });
  }, [pixData, clientName]);

  const handleMarkPaid = useCallback(() => {
    Alert.alert(
      'Confirmar pagamento',
      'Marcar este pagamento como recebido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: () => {
            onMarkPaid();
            onClose();
          },
        },
      ],
    );
  }, [onMarkPaid, onClose]);

  const isExpired = timeLeft <= 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cobranca PIX</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Fechar">
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {!pixData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#16A34A" />
            <Text style={styles.loadingText}>Gerando PIX...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Cliente e countdown */}
            <Text style={styles.clientLabel}>{clientName}</Text>

            <View style={[styles.countdownBadge, isExpired && styles.countdownBadgeExpired]}>
              <Text style={[styles.countdownText, isExpired && styles.countdownTextExpired]}>
                {isExpired ? 'QR Code expirado' : `Expira em ${formatCountdown(timeLeft)}`}
              </Text>
            </View>

            {/* QR Code */}
            {!isExpired && (
              <View style={styles.qrContainer}>
                <Image
                  source={{ uri: `data:image/png;base64,${pixData.qr_code}` }}
                  style={styles.qrImage}
                  resizeMode="contain"
                  accessibilityLabel="QR Code PIX"
                />
              </View>
            )}

            {/* Copia e Cola */}
            <Text style={styles.sectionLabel}>Copia e cola</Text>
            <View style={styles.copyRow}>
              <Text style={styles.copyCode} numberOfLines={2} ellipsizeMode="middle">
                {pixData.copy_paste}
              </Text>
              <TouchableOpacity
                style={[styles.copyButton, copied && styles.copyButtonCopied]}
                onPress={handleCopyCode}
                activeOpacity={0.7}
                accessibilityLabel="Copiar codigo PIX"
              >
                <Text style={styles.copyButtonText}>{copied ? 'Copiado!' : 'Copiar'}</Text>
              </TouchableOpacity>
            </View>

            {/* Acoes */}
            <TouchableOpacity
              style={styles.btnWhatsApp}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <Text style={styles.btnWhatsAppText}>Enviar link por WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnMarkPaid}
              onPress={handleMarkPaid}
              activeOpacity={0.7}
            >
              <Text style={styles.btnMarkPaidText}>Marcar como pago</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#6B7280',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  clientLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  countdownBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  countdownBadgeExpired: {
    backgroundColor: '#FEE2E2',
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  countdownTextExpired: {
    color: '#DC2626',
  },
  qrContainer: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    padding: 8,
  },
  qrImage: {
    width: 224,
    height: 224,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    width: '100%',
    marginBottom: 24,
    gap: 10,
  },
  copyCode: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#16A34A',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  copyButtonCopied: {
    backgroundColor: '#15803D',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  btnWhatsApp: {
    width: '100%',
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 52,
    justifyContent: 'center',
  },
  btnWhatsAppText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  btnMarkPaid: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minHeight: 52,
    justifyContent: 'center',
  },
  btnMarkPaidText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});
