import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useExpenses, useMonthlyExpenses } from '@/hooks/useFinance';
import { useAuthStore } from '@/stores/authStore';
import { EXPENSE_CATEGORIES } from '@shared/schemas/expenseSchema';
import { formatCurrency } from '@shared/utils/formatCurrency';
import type { ExpenseModel } from '@/database/models/Expense';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getCategoryLabel(id: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function getCategoryEmoji(id: string): string {
  const map: Record<string, string> = {
    fuel: '⛽',
    tools: '🔧',
    supplies: '🌿',
    maintenance: '🛠️',
    other: '📦',
  };
  return map[id] ?? '📦';
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ---------------------------------------------------------------------------
// Month Selector
// ---------------------------------------------------------------------------

interface MonthSelectorProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
}

function MonthSelector({ month, year, onPrev, onNext }: MonthSelectorProps) {
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  return (
    <View style={styles.monthSelector}>
      <TouchableOpacity style={styles.monthArrow} onPress={onPrev} activeOpacity={0.7}>
        <Text style={styles.monthArrowText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.monthLabel}>
        {MONTH_NAMES[month - 1]} {year}
      </Text>
      <TouchableOpacity
        style={[styles.monthArrow, isCurrentMonth ? styles.monthArrowDisabled : null]}
        onPress={onNext}
        activeOpacity={0.7}
        disabled={isCurrentMonth}
      >
        <Text style={[styles.monthArrowText, isCurrentMonth ? styles.monthArrowTextDisabled : null]}>
          {'>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Expense Item
// ---------------------------------------------------------------------------

function ExpenseItem({ expense }: { expense: ExpenseModel }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemEmoji}>{getCategoryEmoji(expense.category)}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemDescription} numberOfLines={1}>
            {expense.description}
          </Text>
          <View style={styles.itemMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{getCategoryLabel(expense.category)}</Text>
            </View>
            <Text style={styles.itemDate}>{formatDate(expense.date)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.itemAmount}>{formatCurrency(expense.amount)}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function ExpensesScreen() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { expenses, loading, refetch } = useExpenses(userId, month, year);
  const { total, refetch: refetchTotal } = useMonthlyExpenses(userId, month, year);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchTotal()]);
    setRefreshing(false);
  }, [refetch, refetchTotal]);

  const handlePrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // Agrupar por categoria
  const grouped = useMemo(() => {
    const map = new Map<string, ExpenseModel[]>();
    for (const e of expenses) {
      if (!map.has(e.category)) map.set(e.category, []);
      map.get(e.category)!.push(e);
    }
    return Array.from(map.entries()).map(([cat, items]) => ({
      category: cat,
      label: getCategoryLabel(cat),
      emoji: getCategoryEmoji(cat),
      items,
      subtotal: items.reduce((acc, e) => acc + e.amount, 0),
    }));
  }, [expenses]);

  // Flatten para FlatList com headers de grupo
  type ListItem =
    | { type: 'header'; category: string; label: string; emoji: string; subtotal: number }
    | { type: 'item'; expense: ExpenseModel };

  const flatData: ListItem[] = useMemo(() => {
    const result: ListItem[] = [];
    for (const group of grouped) {
      result.push({ type: 'header', category: group.category, label: group.label, emoji: group.emoji, subtotal: group.subtotal });
      for (const expense of group.items) {
        result.push({ type: 'item', expense });
      }
    }
    return result;
  }, [grouped]);

  return (
    <SafeAreaView style={styles.container}>
      <MonthSelector month={month} year={year} onPrev={handlePrev} onNext={handleNext} />

      <FlatList
        data={flatData}
        keyExtractor={(item, idx) =>
          item.type === 'header' ? `header-${item.category}` : `item-${item.expense.id}-${idx}`
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={styles.groupHeader}>
                <Text style={styles.groupHeaderEmoji}>{item.emoji}</Text>
                <Text style={styles.groupHeaderLabel}>{item.label}</Text>
                <Text style={styles.groupHeaderSubtotal}>{formatCurrency(item.subtotal)}</Text>
              </View>
            );
          }
          return <ExpenseItem expense={item.expense} />;
        }}
        contentContainerStyle={flatData.length === 0 ? styles.emptyContainer : styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={handleRefresh}
            tintColor="#16A34A"
            colors={['#16A34A']}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContent}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhuma despesa em {MONTH_NAMES[month - 1]}</Text>
              <Text style={styles.emptySubtitle}>
                Use o botao "+" na tela inicial para registrar uma despesa.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          flatData.length > 0 ? (
            <View style={styles.footer}>
              <Text style={styles.footerLabel}>Total de despesas</Text>
              <Text style={styles.footerTotal}>{formatCurrency(total)}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  monthArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthArrowDisabled: {
    backgroundColor: '#F9FAFB',
  },
  monthArrowText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  monthArrowTextDisabled: {
    color: '#D1D5DB',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F0FDF4',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D1FAE5',
    gap: 8,
    marginTop: 8,
  },
  groupHeaderEmoji: {
    fontSize: 18,
  },
  groupHeaderLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  groupHeaderSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemEmoji: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  itemDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  footerLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
