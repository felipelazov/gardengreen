import { Q } from '@nozbe/watermelondb';
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

import { ContactActions } from '@/components/clients/ContactActions';
import { database } from '@/database';
import type { ClientModel } from '@/database/models/Client';
import type { ServiceModel } from '@/database/models/Service';
import { useClient, useUpdateClient } from '@/hooks/useClients';

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color = '#111827',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color }}>{value}</Text>
      <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#DCFCE7', text: '#15803D', label: 'Ativo' },
  inactive: { bg: '#F3F4F6', text: '#6B7280', label: 'Inativo' },
  pending_payment: { bg: '#FEF9C3', text: '#A16207', label: 'Pagamento Pendente' },
};

// ─── Nav Tab ───────────────────────────────────────────────────────────────────

function NavTab({
  label,
  emoji,
  onPress,
}: {
  label: string;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, loading } = useClient(id ?? '');
  const { updateClient, loading: updatingStatus } = useUpdateClient();

  const [services, setServices] = useState<ServiceModel[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const collection = database.get<ServiceModel>('services');
    const query = collection.query(Q.where('client_id', id));

    const sub = query.observe().subscribe({
      next: (results) => {
        setServices(results);
        setStatsLoading(false);
      },
      error: () => setStatsLoading(false),
    });

    return () => sub.unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>Cliente nao encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#16A34A', fontWeight: '600' }}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const totalServices = services.length;
  const totalValue = services.reduce((sum, s) => sum + (s.value ?? 0), 0);
  const pendingServices = services.filter((s) => s.status === 'pending_payment');
  const pendingAmount = pendingServices.reduce((sum, s) => sum + (s.value ?? 0), 0);

  const statusConfig = STATUS_CONFIG[client.status] ?? STATUS_CONFIG['active'];

  function handleToggleStatus() {
    const newStatus = client!.status === 'active' ? 'inactive' : 'active';
    const label = newStatus === 'active' ? 'ativar' : 'desativar';

    Alert.alert(
      'Alterar status',
      `Deseja ${label} este cliente?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateClient(client!, { status: newStatus });
            } catch {
              Alert.alert('Erro', 'Nao foi possivel alterar o status.');
            }
          },
        },
      ],
    );
  }

  function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header bar */}
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
          numberOfLines={1}
        >
          Ficha do Cliente
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/clients/${id}/edit` as any)}
          activeOpacity={0.7}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 15, color: '#16A34A', fontWeight: '600' }}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name + status */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#DCFCE7',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#15803D' }}>
              {getInitials(client.name)}
            </Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', textAlign: 'center' }}>
            {client.name}
          </Text>

          <TouchableOpacity
            onPress={handleToggleStatus}
            disabled={updatingStatus}
            style={{
              backgroundColor: statusConfig.bg,
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 5,
              marginTop: 8,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusConfig.text }}>
              {statusConfig.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contact info */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Contato
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>📞</Text>
            <Text style={{ fontSize: 15, color: '#111827' }}>{client.phone}</Text>
          </View>

          {client.email ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>✉️</Text>
              <Text style={{ fontSize: 15, color: '#111827' }}>{client.email}</Text>
            </View>
          ) : null}

          {(client.address || client.neighborhood || client.city) ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 18, marginRight: 10 }}>📍</Text>
              <Text style={{ fontSize: 15, color: '#111827', flex: 1 }}>
                {[client.address, client.neighborhood, client.city].filter(Boolean).join(', ')}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Contact action buttons */}
        <View style={{ marginBottom: 16 }}>
          <ContactActions phone={client.phone} clientName={client.name} />
        </View>

        {/* Stats */}
        {!statsLoading && (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
            <StatCard label="Servicos" value={String(totalServices)} />
            <StatCard
              label="Total gerado"
              value={`R$ ${totalValue.toFixed(2).replace('.', ',')}`}
              color="#15803D"
            />
            {pendingAmount > 0 && (
              <StatCard
                label="Pendente"
                value={`R$ ${pendingAmount.toFixed(2).replace('.', ',')}`}
                color="#D97706"
              />
            )}
          </View>
        )}

        {/* Notes preview */}
        {client.notes ? (
          <View
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: 12,
              padding: 14,
              borderLeftWidth: 3,
              borderLeftColor: '#F59E0B',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#92400E', marginBottom: 6 }}>
              OBSERVACOES
            </Text>
            <Text style={{ fontSize: 14, color: '#78350F' }}>{client.notes}</Text>
          </View>
        ) : null}

        {/* Navigation tabs */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Ver mais
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <NavTab
            label="Historico"
            emoji="📋"
            onPress={() => router.push(`/(tabs)/clients/${id}/history`)}
          />
          <NavTab
            label="Fotos"
            emoji="📸"
            onPress={() => router.push(`/(tabs)/clients/${id}/photos`)}
          />
          <NavTab
            label="Notas"
            emoji="📝"
            onPress={() => router.push(`/(tabs)/clients/${id}/notes`)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
