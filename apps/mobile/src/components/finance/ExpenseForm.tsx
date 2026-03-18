import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { EXPENSE_CATEGORIES } from '@shared/schemas/expenseSchema';
import { parseCurrency } from '@shared/utils/formatCurrency';
import type { CreateExpenseInput, ExpenseCategoryId } from '@shared/schemas/expenseSchema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExpenseFormProps {
  onSubmit: (input: CreateExpenseInput) => Promise<void>;
  loading?: boolean;
}

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAmountDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  const reais = cents / 100;
  return reais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExpenseForm({ onSubmit, loading = false }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  const [category, setCategory] = useState<ExpenseCategoryId | null>(null);
  const [date] = useState(getToday());
  const [errors, setErrors] = useState<FormErrors>({});

  const handleAmountChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setAmountDisplay(formatAmountDisplay(digits));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Descricao e obrigatoria';
    } else if (description.trim().length > 200) {
      newErrors.description = 'Descricao deve ter no maximo 200 caracteres';
    }

    const digits = amountDisplay.replace(/\D/g, '');
    if (!digits || parseInt(digits, 10) === 0) {
      newErrors.amount = 'Informe um valor valido';
    }

    if (!category) {
      newErrors.category = 'Selecione uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !category) return;

    const digits = amountDisplay.replace(/\D/g, '');
    const amountInCents = parseInt(digits, 10);

    await onSubmit({
      description: description.trim(),
      amount: amountInCents,
      category,
      date,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Descricao */}
      <View style={styles.field}>
        <Text style={styles.label}>Descricao</Text>
        <TextInput
          style={[styles.input, errors.description ? styles.inputError : null]}
          placeholder="Ex: Gasolina para visitas"
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
          }}
          maxLength={200}
          returnKeyType="next"
          editable={!loading}
        />
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}
      </View>

      {/* Valor */}
      <View style={styles.field}>
        <Text style={styles.label}>Valor</Text>
        <View style={[styles.amountRow, errors.amount ? styles.inputError : null]}>
          <Text style={styles.currencyPrefix}>R$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0,00"
            placeholderTextColor="#9CA3AF"
            value={amountDisplay}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            returnKeyType="done"
            editable={!loading}
          />
        </View>
        {errors.amount ? (
          <Text style={styles.errorText}>{errors.amount}</Text>
        ) : null}
      </View>

      {/* Categoria */}
      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipsRow}>
          {EXPENSE_CATEGORIES.map((cat) => {
            const selected = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
                onPress={() => {
                  setCategory(cat.id as ExpenseCategoryId);
                  if (errors.category) setErrors((e) => ({ ...e, category: undefined }));
                }}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.category ? (
          <Text style={styles.errorText}>{errors.category}</Text>
        ) : null}
      </View>

      {/* Data */}
      <View style={styles.field}>
        <Text style={styles.label}>Data</Text>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>
            {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Botao Salvar */}
      <TouchableOpacity
        style={[styles.saveButton, loading ? styles.saveButtonDisabled : null]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Despesa</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#374151',
  },
  dateDisplay: {
    height: 56,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
  },
  saveButton: {
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#86EFAC',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
