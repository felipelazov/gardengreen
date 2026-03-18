import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientCard } from '@/components/clients/ClientCard';
import type { ClientModel } from '@/database/models/Client';
import { useClientSearch, type ClientFilter } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';

const FILTERS: { label: string; value: ClientFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Pendentes', value: 'pending_payment' },
];

export default function ClientsScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<ClientFilter>('all');

  const { clients, loading } = useClientSearch(userId, searchText, activeFilter);

  const handleCardPress = useCallback((client: ClientModel) => {
    router.push(`/(tabs)/clients/${client.id}`);
  }, []);

  function renderEmpty() {
    if (loading) return null;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🌿</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', textAlign: 'center' }}>
          {searchText ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
          {searchText
            ? 'Tente buscar por outro nome ou telefone'
            : 'Toque no botao + para adicionar seu primeiro cliente'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#14532D' }}>Clientes</Text>
        {!loading && (
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </Text>
        )}
      </View>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 18, marginRight: 10, color: '#9CA3AF' }}>🔍</Text>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nome, telefone ou endereco..."
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, fontSize: 15, color: '#111827' }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter chips */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          gap: 8,
          marginBottom: 12,
        }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
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
        })}
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#16A34A" />
        </View>
      )}

      {/* List */}
      {!loading && (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClientCard client={item} onPress={() => handleCardPress(item)} />
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
        onPress={() => router.push('/(tabs)/clients/new')}
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
