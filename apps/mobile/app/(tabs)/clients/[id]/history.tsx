import { Q } from '@nozbe/watermelondb';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { database } from '@/database';
import type { ServiceModel } from '@/database/models/Service';

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  scheduled: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Agendado' },
  completed: { bg: '#DCFCE7', text: '#15803D', label: 'Concluido' },
  pending_payment: { bg: '#FEF9C3', text: '#A16207', label: 'Pend. Pgto' },
  cancelled: { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelado' },
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  landscaping: 'Paisagismo',
  lawn_mowing: 'Corte de Grama',
  tree_pruning: 'Poda de Arvore',
  planting: 'Plantio',
  irrigation: 'Irrigacao',
  pest_control: 'Controle de Pragas',
  cleaning: 'Limpeza',
  maintenance: 'Manutencao',
  other: 'Outro',
};

// ─── Service Item ──────────────────────────────────────────────────────────────

function ServiceItem({ service }: { service: ServiceModel }) {
  const status = STATUS_CONFIG[service.status] ?? {
    bg: '#F3F4F6',
    text: '#6B7280',
    label: service.status,
  };
  const typeLabel = SERVICE_TYPE_LABELS[service.type] ?? service.type;
  const isPending = service.status === 'pending_payment';

  // Format date: "2024-01-15" → "15/01/2024"
  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  }

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: isPending ? 4 : 0,
        borderLeftColor: isPending ? '#F59E0B' : 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
            {typeLabel}
          </Text>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            {formatDate(service.date)}
            {service.time ? `  •  ${service.time}` : ''}
          </Text>
          {service.description ? (
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }} numberOfLines={2}>
              {service.description}
            </Text>
          ) : null}
        </View>

        <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: isPending ? '#D97706' : '#111827', marginBottom: 6 }}>
            R$ {(service.value ?? 0).toFixed(2).replace('.', ',')}
          </Text>
          <View
            style={{
              backgroundColor: status.bg,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: status.text }}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const collection = database.get<ServiceModel>('services');
    const query = collection.query(
      Q.where('client_id', id),
      Q.sortBy('date', Q.desc),
    );

    const sub = query.observe().subscribe({
      next: (results) => {
        setServices(results);
        setLoading(false);
      },
      error: (err) => {
        console.error('[ClientHistory] observe error:', err);
        setLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, [id]);

  const pendingServices = services.filter((s) => s.status === 'pending_payment');
  const pendingTotal = pendingServices.reduce((sum, s) => sum + (s.value ?? 0), 0);

  function handleCobrancaPendentes() {
    const names = pendingServices.length;
    const total = `R$ ${pendingTotal.toFixed(2).replace('.', ',')}`;
    Alert.alert(
      'Cobrar Pendentes',
      `Ha ${names} ${names === 1 ? 'servico' : 'servicos'} pendentes totalizando ${total}.\n\nDeseja abrir o WhatsApp para cobrar?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'WhatsApp',
          onPress: () => {
            // Navigate back to client detail to use ContactActions
            router.back();
          },
        },
      ],
    );
  }

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
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18, color: '#16A34A' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '700',
            color: '#14532D',
          }}
        >
          Historico de Servicos
        </Text>
        <View style={{ width: 72 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ServiceItem service={item} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            pendingServices.length > 0 ? (
              <TouchableOpacity
                onPress={handleCobrancaPendentes}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FEF9C3',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#FCD34D',
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#92400E' }}>
                    {pendingServices.length} {pendingServices.length === 1 ? 'servico pendente' : 'servicos pendentes'}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#A16207' }}>
                    Total: R$ {pendingTotal.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#D97706' }}>
                  Cobrar →
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
                Nenhum servico registrado
              </Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>
                Os servicos realizados para este cliente aparecao aqui
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
