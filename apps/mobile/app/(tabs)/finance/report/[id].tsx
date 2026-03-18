import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatCurrency } from '@shared/utils/formatCurrency';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MonthlyReport {
  id: string;
  month: number;
  year: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  servicesCompleted: number;
  clientsServed: number;
  pendingTotal: number;
  previousMonths?: Array<{
    month: number;
    year: number;
    revenue: number;
    expenses: number;
  }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? String(month);
}

// ---------------------------------------------------------------------------
// Bar Chart — ultimos 3 meses
// ---------------------------------------------------------------------------

interface BarChartProps {
  data: Array<{
    month: number;
    year: number;
    revenue: number;
    expenses: number;
  }>;
}

function BarChart({ data }: BarChartProps) {
  const MAX_HEIGHT = 120;
  const maxValue = Math.max(...data.flatMap((d) => [d.revenue, d.expenses]), 1);

  return (
    <View style={chartStyles.container}>
      <Text style={chartStyles.title}>Ultimos 3 meses</Text>
      <View style={chartStyles.barsContainer}>
        {data.map((d, idx) => {
          const revenueH = (d.revenue / maxValue) * MAX_HEIGHT;
          const expensesH = (d.expenses / maxValue) * MAX_HEIGHT;
          const isEmpty = d.revenue === 0 && d.expenses === 0;

          return (
            <View key={`${d.year}-${d.month}-${idx}`} style={chartStyles.group}>
              {/* Valores acima */}
              <View style={[chartStyles.valuesRow, { height: MAX_HEIGHT + 32 }]}>
                <View style={[chartStyles.barWrapper, { justifyContent: 'flex-end' }]}>
                  {!isEmpty && (
                    <Text style={[chartStyles.barValueText, { color: '#16A34A' }]} numberOfLines={1}>
                      {formatCurrency(d.revenue)}
                    </Text>
                  )}
                  <View
                    style={[
                      chartStyles.bar,
                      chartStyles.barRevenue,
                      { height: isEmpty ? 4 : Math.max(revenueH, 4) },
                    ]}
                  />
                </View>
                <View style={[chartStyles.barWrapper, { justifyContent: 'flex-end' }]}>
                  {!isEmpty && (
                    <Text style={[chartStyles.barValueText, { color: '#DC2626' }]} numberOfLines={1}>
                      {formatCurrency(d.expenses)}
                    </Text>
                  )}
                  <View
                    style={[
                      chartStyles.bar,
                      chartStyles.barExpenses,
                      { height: isEmpty ? 4 : Math.max(expensesH, 4) },
                    ]}
                  />
                </View>
              </View>

              {/* Label do mes */}
              <Text style={chartStyles.monthLabel} numberOfLines={1}>
                {getMonthName(d.month).substring(0, 3)}
              </Text>
              {isEmpty && <Text style={chartStyles.emptyLabel}>Sem dados</Text>}
            </View>
          );
        })}
      </View>

      {/* Legenda */}
      <View style={chartStyles.legend}>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: '#16A34A' }]} />
          <Text style={chartStyles.legendText}>Receita</Text>
        </View>
        <View style={chartStyles.legendItem}>
          <View style={[chartStyles.legendDot, { backgroundColor: '#DC2626' }]} />
          <Text style={chartStyles.legendText}>Despesas</Text>
        </View>
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
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
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  group: {
    flex: 1,
    alignItems: 'center',
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  barWrapper: {
    alignItems: 'center',
    width: 32,
  },
  barValueText: {
    fontSize: 8,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  bar: {
    width: 28,
    borderRadius: 4,
    minHeight: 4,
  },
  barRevenue: {
    backgroundColor: '#16A34A',
  },
  barExpenses: {
    backgroundColor: '#DC2626',
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  emptyLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

// ---------------------------------------------------------------------------
// Big Number Card
// ---------------------------------------------------------------------------

function BigNumberCard({
  label,
  value,
  color,
  emoji,
}: {
  label: string;
  value: string;
  color: string;
  emoji: string;
}) {
  return (
    <View style={bigCardStyles.card}>
      <Text style={bigCardStyles.emoji}>{emoji}</Text>
      <Text style={bigCardStyles.label}>{label}</Text>
      <Text style={[bigCardStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const bigCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
});

// ---------------------------------------------------------------------------
// Mock data loader — em producao, buscar do Supabase via ID
// ---------------------------------------------------------------------------

function useReport(id: string): MonthlyReport | null {
  // TODO: Em producao, buscar da tabela monthly_reports onde id = param
  // Por ora, retornar mock para demonstracao
  const now = new Date();
  return {
    id,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalRevenue: 350000,
    totalExpenses: 85000,
    netProfit: 265000,
    servicesCompleted: 12,
    clientsServed: 8,
    pendingTotal: 120000,
    previousMonths: [
      {
        month: now.getMonth() - 1 < 1 ? 12 : now.getMonth(),
        year: now.getMonth() - 1 < 1 ? now.getFullYear() - 1 : now.getFullYear(),
        revenue: 280000,
        expenses: 72000,
      },
      {
        month: now.getMonth() < 1 ? 11 : now.getMonth(),
        year: now.getFullYear(),
        revenue: 320000,
        expenses: 90000,
      },
      {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        revenue: 350000,
        expenses: 85000,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function MonthlyReportScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const report = useReport(id ?? '');

  const shareText = useMemo(() => {
    if (!report) return '';
    return [
      `Relatorio GardenGreen - ${getMonthName(report.month)} ${report.year}`,
      '─────────────────────',
      `Receita:       ${formatCurrency(report.totalRevenue)}`,
      `Despesas:      ${formatCurrency(report.totalExpenses)}`,
      `Lucro Liquido: ${formatCurrency(report.netProfit)}`,
      '─────────────────────',
      `Servicos concluidos: ${report.servicesCompleted}`,
      `Clientes atendidos:  ${report.clientsServed}`,
      `Pendente a receber:  ${formatCurrency(report.pendingTotal)}`,
      '─────────────────────',
      'GardenGreen App 🌿',
    ].join('\n');
  }, [report]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: shareText,
        title: `Relatorio ${getMonthName(report?.month ?? 1)} ${report?.year}`,
      });
    } catch (err) {
      Alert.alert('Erro', 'Nao foi possivel compartilhar o relatorio.');
    }
  };

  if (!report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Carregando relatorio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isNegative = report.netProfit < 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backText}>{'< Voltar'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Relatorio de {getMonthName(report.month)} {report.year}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Grandes numeros */}
        <View style={styles.bigNumbersRow}>
          <BigNumberCard
            label="Receita"
            value={formatCurrency(report.totalRevenue)}
            color="#16A34A"
            emoji="💰"
          />
          <BigNumberCard
            label="Despesas"
            value={formatCurrency(report.totalExpenses)}
            color="#DC2626"
            emoji="📉"
          />
        </View>

        {/* Lucro liquido em destaque */}
        <View style={[styles.profitCard, isNegative ? styles.profitCardNegative : styles.profitCardPositive]}>
          <Text style={styles.profitCardLabel}>Lucro Liquido</Text>
          <Text style={[styles.profitCardValue, isNegative ? styles.profitNegative : styles.profitPositive]}>
            {isNegative ? '- ' : '+ '}
            {formatCurrency(Math.abs(report.netProfit))}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🌿 Servicos concluidos</Text>
            <Text style={styles.statValue}>{report.servicesCompleted}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>👤 Clientes atendidos</Text>
            <Text style={styles.statValue}>{report.clientsServed}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>⏳ Pendente a receber</Text>
            <Text style={[styles.statValue, styles.pendingValue]}>
              {formatCurrency(report.pendingTotal)}
            </Text>
          </View>
        </View>

        {/* Grafico de barras */}
        {report.previousMonths && report.previousMonths.length > 0 && (
          <BarChart data={report.previousMonths} />
        )}

        {/* Botao compartilhar */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>Compartilhar Relatorio</Text>
        </TouchableOpacity>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    marginBottom: 4,
  },
  backText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  bigNumbersRow: {
    flexDirection: 'row',
    gap: 10,
  },
  profitCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  profitCardPositive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  profitCardNegative: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  profitCardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  profitCardValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  profitPositive: {
    color: '#16A34A',
  },
  profitNegative: {
    color: '#DC2626',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  pendingValue: {
    color: '#D97706',
  },
  shareButton: {
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
