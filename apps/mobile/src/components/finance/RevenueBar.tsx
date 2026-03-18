import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '@shared/utils/formatCurrency';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RevenueBarProps {
  revenue: number;
  expenses: number;
  netProfit: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RevenueBar({ revenue, expenses, netProfit }: RevenueBarProps) {
  const max = Math.max(revenue, expenses, 1);
  const revenueWidth = (revenue / max) * 100;
  const expensesWidth = (expenses / max) * 100;

  const isNegative = netProfit < 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receita vs Despesas</Text>

      {/* Barra de Receita */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>Receita</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              styles.barRevenue,
              { width: `${revenueWidth}%` },
            ]}
          />
        </View>
        <Text style={[styles.barValue, styles.revenueText]}>
          {formatCurrency(revenue)}
        </Text>
      </View>

      {/* Barra de Despesas */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>Despesas</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              styles.barExpenses,
              { width: `${expensesWidth}%` },
            ]}
          />
        </View>
        <Text style={[styles.barValue, styles.expensesText]}>
          {formatCurrency(expenses)}
        </Text>
      </View>

      {/* Divisor */}
      <View style={styles.divider} />

      {/* Lucro Liquido */}
      <View style={styles.profitRow}>
        <Text style={styles.profitLabel}>Lucro Liquido</Text>
        <Text
          style={[
            styles.profitValue,
            isNegative ? styles.profitNegative : styles.profitPositive,
          ]}
        >
          {formatCurrency(Math.abs(netProfit))}
          {isNegative ? ' (prejuizo)' : ''}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    width: 60,
  },
  barTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    minWidth: 4,
  },
  barRevenue: {
    backgroundColor: '#16A34A',
  },
  barExpenses: {
    backgroundColor: '#DC2626',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    width: 80,
    textAlign: 'right',
  },
  revenueText: {
    color: '#16A34A',
  },
  expensesText: {
    color: '#DC2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  profitPositive: {
    color: '#16A34A',
  },
  profitNegative: {
    color: '#DC2626',
  },
});
