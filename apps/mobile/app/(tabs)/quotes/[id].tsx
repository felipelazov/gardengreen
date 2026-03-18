import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QUOTE_STATUS_CONFIG } from '@/components/quotes/QuoteCard';
import { database } from '@/database';
import type { QuoteModel } from '@/database/models/Quote';
import type { ClientModel } from '@/database/models/Client';
import { useUpdateQuoteStatus, useConvertToService } from '@/hooks/useQuotes';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { generateQuoteMessage, sendViaWhatsApp } from '@/services/whatsappService';
import type { QuoteItem } from '@shared/schemas/quoteSchema';

function StatusBadge({ status }: { status: string }) {
  const config = QUOTE_STATUS_CONFIG[status] ?? QUOTE_STATUS_CONFIG['draft'];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: config.text }}>{config.label}</Text>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'whatsapp';
  disabled?: boolean;
}) {
  const styles = {
    primary: { bg: '#16A34A', text: '#FFFFFF', border: '#16A34A' },
    secondary: { bg: '#FFFFFF', text: '#16A34A', border: '#16A34A' },
    danger: { bg: '#FFFFFF', text: '#DC2626', border: '#DC2626' },
    whatsapp: { bg: '#25D366', text: '#FFFFFF', border: '#25D366' },
  };
  const s = styles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{
        paddingVertical: 13,
        borderRadius: 12,
        backgroundColor: disabled ? '#E5E7EB' : s.bg,
        borderWidth: 1.5,
        borderColor: disabled ? '#E5E7EB' : s.border,
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: '700',
          color: disabled ? '#9CA3AF' : s.text,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const [quote, setQuote] = useState<QuoteModel | null>(null);
  const [client, setClient] = useState<ClientModel | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { updateStatus, loading: updatingStatus } = useUpdateQuoteStatus();
  const { convertToService, loading: converting } = useConvertToService();

  useEffect(() => {
    async function load() {
      try {
        const q = await database.get<QuoteModel>('quotes').find(id);
        setQuote(q);
        setItems(JSON.parse(q.items));

        const c = await database.get<ClientModel>('clients').find(q.clientId);
        setClient(c);
      } catch (err) {
        console.error('[QuoteDetail] load error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleUpdateStatus(status: string) {
    if (!quote) return;
    await updateStatus(quote.id, status);
    // Recarregar
    const updated = await database.get<QuoteModel>('quotes').find(quote.id);
    setQuote(updated);
  }

  async function handleSendWhatsApp() {
    if (!quote || !client) return;
    if (!client.phone) {
      Alert.alert(
        'Sem telefone',
        'Este cliente nao tem telefone cadastrado. Edite o cadastro do cliente para adicionar.',
      );
      return;
    }
    const gardenerName = user?.name ?? 'Jardineiro';
    const message = generateQuoteMessage({
      gardenerName,
      clientName: client.name,
      quoteNumber: quote.number,
      items,
      total: quote.total,
      validUntil: quote.validUntil,
    });
    sendViaWhatsApp(client.phone, message);
    // Marcar como enviado automaticamente
    if (quote.status === 'draft') {
      await handleUpdateStatus('sent');
    }
  }

  async function handleConvert() {
    if (!quote) return;
    Alert.alert(
      'Agendar Servico',
      `Deseja criar um servico a partir do orcamento ${quote.number}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const service = await convertToService(userId, quote.id);
              router.push(`/(tabs)/agenda/${service.id}`);
            } catch {
              Alert.alert('Erro', 'Nao foi possivel criar o servico. Tente novamente.');
            }
          },
        },
      ],
    );
  }

  async function handleMarkRejected() {
    Alert.alert(
      'Marcar como Recusado',
      'Tem certeza que deseja marcar este orcamento como recusado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: () => handleUpdateStatus('rejected'),
        },
      ],
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  if (!quote || !client) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#6B7280', fontSize: 16 }}>Orcamento nao encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#16A34A', fontSize: 15 }}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [year, month, day] = quote.validUntil.split('-');
  const validFormatted = `${day}/${month}/${year}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 17, color: '#16A34A' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#14532D', flex: 1 }}>
          {quote.number}
        </Text>
        <StatusBadge status={quote.status} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          {/* Cliente */}
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 2 }}>
            CLIENTE
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
            {client.name}
          </Text>
          {client.phone ? (
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>{client.phone}</Text>
          ) : (
            <Text style={{ fontSize: 14, color: '#FCA5A5', marginBottom: 16 }}>
              Sem telefone cadastrado
            </Text>
          )}

          {/* Data de criacao */}
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>
            Criado em {quote.createdAt.toLocaleDateString('pt-BR')} • Valido ate {validFormatted}
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 }} />

          {/* Itens */}
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 10 }}>
            ITENS
          </Text>
          {items.map((item, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                  {item.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {formatCurrency(item.value)} x {item.quantity}
                </Text>
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151' }}>
                {formatCurrency(item.value * item.quantity)}
              </Text>
            </View>
          ))}

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 }} />

          {/* Total */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#14532D' }}>Total</Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#15803D' }}>
              {formatCurrency(quote.total)}
            </Text>
          </View>

          {/* Observacoes */}
          {quote.notes ? (
            <>
              <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 }} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>
                OBSERVACOES
              </Text>
              <Text style={{ fontSize: 14, color: '#374151' }}>{quote.notes}</Text>
            </>
          ) : null}
        </View>

        {/* Acoes por status */}
        <View>
          {/* Rascunho */}
          {quote.status === 'draft' && (
            <>
              <ActionButton
                label="📱 Enviar por WhatsApp"
                onPress={handleSendWhatsApp}
                variant="whatsapp"
                disabled={updatingStatus}
              />
              <ActionButton
                label="Marcar como Enviado"
                onPress={() => handleUpdateStatus('sent')}
                variant="secondary"
                disabled={updatingStatus}
              />
            </>
          )}

          {/* Enviado */}
          {quote.status === 'sent' && (
            <>
              <ActionButton
                label="Marcar como Aprovado"
                onPress={() => handleUpdateStatus('approved')}
                variant="primary"
                disabled={updatingStatus}
              />
              <ActionButton
                label="📱 Reenviar por WhatsApp"
                onPress={handleSendWhatsApp}
                variant="whatsapp"
                disabled={updatingStatus}
              />
              <ActionButton
                label="Marcar como Recusado"
                onPress={handleMarkRejected}
                variant="danger"
                disabled={updatingStatus}
              />
            </>
          )}

          {/* Aprovado */}
          {quote.status === 'approved' && (
            <ActionButton
              label="📅 Agendar Servico"
              onPress={handleConvert}
              variant="primary"
              disabled={converting}
            />
          )}

          {/* Recusado / Expirado — sem acoes */}
          {(quote.status === 'rejected' || quote.status === 'expired') && (
            <View
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
                {quote.status === 'rejected'
                  ? 'Este orcamento foi recusado pelo cliente.'
                  : 'Este orcamento expirou. Crie um novo orcamento se necessario.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
