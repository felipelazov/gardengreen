import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ExpenseForm } from '@/components/finance/ExpenseForm';
import { useCreateExpense } from '@/hooks/useFinance';
import { useAuthStore } from '@/stores/authStore';
import type { CreateExpenseInput } from '@shared/schemas/expenseSchema';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function NewExpenseScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const { createExpense, loading } = useCreateExpense();

  const handleSubmit = async (input: CreateExpenseInput) => {
    try {
      await createExpense(userId, input);
      router.back();
    } catch (err) {
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel registrar a despesa. Tente novamente.',
        [{ text: 'OK' }],
      );
      console.error('NewExpenseScreen handleSubmit error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Despesa</Text>
        <Text style={styles.headerSubtitle}>Registre um custo do seu negocio</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ExpenseForm onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
