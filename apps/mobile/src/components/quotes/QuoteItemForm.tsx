import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import type { QuoteItem } from '@shared/schemas/quoteSchema';

interface QuoteItemFormProps {
  item: QuoteItem;
  index: number;
  onChange: (index: number, field: keyof QuoteItem, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function QuoteItemForm({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: QuoteItemFormProps) {
  function handleValueChange(text: string) {
    // Aceita "80,00" ou "80.00" e converte para centavos
    const clean = text.replace(/[^\d,]/g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    const cents = isNaN(parsed) ? 0 : Math.round(parsed * 100);
    onChange(index, 'value', cents);
  }

  function displayValue(cents: number): string {
    if (cents === 0) return '';
    return (cents / 100).toFixed(2).replace('.', ',');
  }

  return (
    <View
      style={{
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      {/* Header da linha com numero e botao remover */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>
          Item {index + 1}
        </Text>
        {canRemove && (
          <TouchableOpacity onPress={() => onRemove(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 18, color: '#DC2626', lineHeight: 20 }}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Descricao */}
      <TextInput
        value={item.description}
        onChangeText={(text) => onChange(index, 'description', text)}
        placeholder="Descricao do servico"
        placeholderTextColor="#9CA3AF"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 15,
          color: '#111827',
          marginBottom: 8,
        }}
      />

      {/* Valor + Quantidade na mesma linha */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {/* Valor */}
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>
            Valor (R$)
          </Text>
          <TextInput
            value={displayValue(item.value)}
            onChangeText={handleValueChange}
            placeholder="0,00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 15,
              color: '#111827',
            }}
          />
        </View>

        {/* Quantidade */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>
            Qtd
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={() => onChange(index, 'quantity', Math.max(1, item.quantity - 1))}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text style={{ fontSize: 18, color: '#374151', lineHeight: 20 }}>−</Text>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 15, color: '#111827', fontWeight: '600' }}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => onChange(index, 'quantity', item.quantity + 1)}
              style={{ paddingHorizontal: 12, paddingVertical: 10 }}
            >
              <Text style={{ fontSize: 18, color: '#374151', lineHeight: 20 }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Subtotal */}
      {item.value > 0 && (
        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6, textAlign: 'right' }}>
          Subtotal: R$ {((item.value * item.quantity) / 100).toFixed(2).replace('.', ',')}
        </Text>
      )}
    </View>
  );
}
