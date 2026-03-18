import { router } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuoteCard } from '@/components/quotes/QuoteCard';
import type { QuoteModel } from '@/database/models/Quote';
import { useQuotesByStatus } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';

type QuoteFilter = null | 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

const FILTERS: { label: string; value: QuoteFilter }[] = [
  { label: 'Todos', value: null },
  { label: 'Rascunho', value: 'draft' },
  { label: 'Enviado', value: 'sent' },
  { label: 'Aprovado', value: 'approved' },
  { label: 'Recusado', value: 'rejected' },
  { label: 'Expirado', value: 'expired' },
];

export default function QuotesScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const [activeFilter, setActiveFilter] = useState<QuoteFilter>(null);

  const { quotes, loading } = useQuotesByStatus(userId, activeFilter);
  const { clients } = useClients(userId);

  // Mapa de clientId → nome para exibir nos cards
  const clientMap = useCallback(
    (clientId: string): string => {
      const found = clients.find((c) => c.id === clientId);
      return found?.name ?? 'Cliente';
    },
    [clients],
  );

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📋</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', textAlign: 'center' }}>
          {activeFilter ? 'Nenhum orcamento neste status' : 'Nenhum orcamento ainda'}
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
          {activeFilter
            ? 'Tente outro filtro ou crie um novo orcamento'
            : 'Toque em + para criar seu primeiro orcamento'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#14532D' }}>Orcamentos</Text>
        {!loading && (
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            {quotes.length} {quotes.length === 1 ? 'orcamento' : 'orcamentos'}
          </Text>
        )}
      </View>

      {/* Filter chips */}
      <View style={{ paddingBottom: 12 }}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => String(item.value)}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item: f }) => {
            const isActive = activeFilter === f.value;
            return (
              <TouchableOpacity
                onPress={() => setActiveFilter(f.value)}
                activeOpacity={0.75}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? '#16A34A' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isActive ? '#16A34A' : '#E5E7EB',
                  shadowColor: '#000',
                  shadowOpacity: isActive ? 0.1 : 0.03,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: isActive ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : '#6B7280',
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      )}

      {/* Lista */}
      {!loading && (
        <FlatList
          data={quotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuoteCard
              quote={item}
              clientName={clientMap(item.clientId)}
              onPress={() => router.push(`/(tabs)/quotes/${item.id}`)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/quotes/new')}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          bottom: 28,
          right: 20,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: '#16A34A',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#16A34A',
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <Text style={{ fontSize: 28, color: '#FFFFFF', lineHeight: 32 }}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
