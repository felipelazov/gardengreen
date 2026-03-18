import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuoteItemForm } from '@/components/quotes/QuoteItemForm';
import { useCreateQuote } from '@/hooks/useQuotes';
import { useClients } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { QuoteItem } from '@shared/schemas/quoteSchema';

const INPUT_STYLE = {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  color: '#111827',
} as const;

function defaultValidUntil(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split('T')[0];
}

function emptyItem(): QuoteItem {
  return { description: '', value: 0, quantity: 1 };
}

export default function NewQuoteScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const { clients } = useClients(userId);
  const { createQuote, loading } = useCreateQuote();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>([emptyItem()]);
  const [validUntil, setValidUntil] = useState(defaultValidUntil());
  const [notes, setNotes] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const total = items.reduce((sum, item) => sum + item.value * item.quantity, 0);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const handleItemChange = useCallback(
    (index: number, field: keyof QuoteItem, value: string | number) => {
      setItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        return next;
      });
    },
    [],
  );

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddItem = useCallback(() => {
    setItems((prev) => [...prev, emptyItem()]);
  }, []);

  async function handleSave() {
    if (!selectedClientId) {
      Alert.alert('Cliente obrigatorio', 'Selecione um cliente para o orcamento.');
      return;
    }
    const hasEmptyDescription = items.some((i) => !i.description.trim());
    if (hasEmptyDescription) {
      Alert.alert('Item incompleto', 'Preencha a descricao de todos os itens.');
      return;
    }
    try {
      await createQuote(userId, {
        client_id: selectedClientId,
        items,
        valid_until: validUntil,
        notes: notes || null,
      });
      router.back();
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar o orcamento. Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
            Novo Orcamento
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cliente */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
            Cliente <Text style={{ color: '#DC2626' }}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowClientModal(true)}
            style={{
              ...INPUT_STYLE,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: selectedClient ? '#111827' : '#9CA3AF',
                flex: 1,
              }}
            >
              {selectedClient ? selectedClient.name : 'Selecionar cliente...'}
            </Text>
            <Text style={{ fontSize: 18, color: '#9CA3AF' }}>›</Text>
          </TouchableOpacity>

          {/* Itens */}
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#14532D', marginBottom: 10 }}>
            Itens do Orcamento
          </Text>

          {items.map((item, index) => (
            <QuoteItemForm
              key={index}
              item={item}
              index={index}
              onChange={handleItemChange}
              onRemove={handleRemoveItem}
              canRemove={items.length > 1}
            />
          ))}

          <TouchableOpacity
            onPress={handleAddItem}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: '#16A34A',
              borderStyle: 'dashed',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 20, color: '#16A34A', marginRight: 6 }}>+</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#16A34A' }}>
              Adicionar item
            </Text>
          </TouchableOpacity>

          {/* Total */}
          <View
            style={{
              backgroundColor: '#DCFCE7',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#14532D' }}>Total</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#15803D' }}>
              {formatCurrency(total)}
            </Text>
          </View>

          {/* Validade */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
            Valido ate
          </Text>
          <TextInput
            value={validUntil}
            onChangeText={setValidUntil}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#9CA3AF"
            style={{ ...INPUT_STYLE, marginBottom: 16 }}
          />

          {/* Observacoes */}
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
            Observacoes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Condicoes, prazo de execucao, etc."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={{ ...INPUT_STYLE, minHeight: 80, textAlignVertical: 'top', marginBottom: 24 }}
          />

          {/* Botoes */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowPreview(true)}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#16A34A',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#16A34A' }}>
                Visualizar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              style={{
                flex: 2,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: loading ? '#86EFAC' : '#16A34A',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>
                {loading ? 'Salvando...' : 'Salvar Orcamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal seletor de cliente */}
        <Modal visible={showClientModal} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#14532D', flex: 1 }}>
                Selecionar Cliente
              </Text>
              <TouchableOpacity onPress={() => setShowClientModal(false)}>
                <Text style={{ fontSize: 16, color: '#6B7280' }}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 12 }}>
              <TextInput
                value={clientSearch}
                onChangeText={setClientSearch}
                placeholder="Buscar cliente..."
                placeholderTextColor="#9CA3AF"
                style={{
                  ...INPUT_STYLE,
                  borderRadius: 10,
                }}
                autoFocus
              />
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}>
              {filteredClients.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => {
                    setSelectedClientId(c.id);
                    setShowClientModal(false);
                    setClientSearch('');
                  }}
                  style={{
                    backgroundColor: selectedClientId === c.id ? '#DCFCE7' : '#FFFFFF',
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: selectedClientId === c.id ? '#16A34A' : '#E5E7EB',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    {c.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{c.phone}</Text>
                </TouchableOpacity>
              ))}
              {filteredClients.length === 0 && (
                <View style={{ alignItems: 'center', paddingTop: 40 }}>
                  <Text style={{ fontSize: 15, color: '#9CA3AF' }}>Nenhum cliente encontrado</Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Modal Preview */}
        <Modal visible={showPreview} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#14532D', flex: 1 }}>
                Preview do Orcamento
              </Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <Text style={{ fontSize: 16, color: '#6B7280' }}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 20,
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>
                  ORCAMENTO
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#14532D', marginBottom: 16 }}>
                  ORC-XXX (proximo numero)
                </Text>

                <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 2 }}>
                  CLIENTE
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
                  {selectedClient?.name ?? '—'}
                </Text>

                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 }} />

                <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 8 }}>
                  ITENS
                </Text>
                {items.map((item, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: '#374151', flex: 1 }}>
                      {item.description || '(sem descricao)'} x{item.quantity}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                      {formatCurrency(item.value * item.quantity)}
                    </Text>
                  </View>
                ))}

                <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#14532D' }}>Total</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#15803D' }}>
                    {formatCurrency(total)}
                  </Text>
                </View>

                <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 16 }}>
                  Valido ate: {validUntil}
                </Text>
                {notes ? (
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 8 }}>
                    Obs: {notes}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
