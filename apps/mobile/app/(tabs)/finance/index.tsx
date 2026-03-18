import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DashboardCard } from '@/components/finance/DashboardCard';
import { RevenueBar } from '@/components/finance/RevenueBar';
import { useMonthlyStats } from '@/hooks/useFinance';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@shared/utils/formatCurrency';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function getCurrentMonthName(): string {
  return MONTH_NAMES[new Date().getMonth()];
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🌱</Text>
      <Text style={styles.emptyTitle}>Ainda sem ganhos este mes</Text>
      <Text style={styles.emptySubtitle}>
        Conforme voce registra servicos e recebe pagamentos, seus ganhos aparecem aqui.
      </Text>
      <View style={styles.emptyExample}>
        <Text style={styles.emptyExampleLabel}>Exemplo</Text>
        <Text style={styles.emptyExampleValue}>R$ 1.500,00</Text>
        <Text style={styles.emptyExampleDesc}>3 servicos realizados</Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function FinanceDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';

  const { stats, loading, refetch } = useMonthlyStats(userId);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const isEmpty = !loading && stats.revenue === 0 && stats.expenses === 0;
  const isNegativeProfit = stats.netProfit < 0;

  const renderChangeBadge = () => {
    if (stats.revenueChangePercent === null) return null;
    const pct = stats.revenueChangePercent;
    const isPositive = pct >= 0;
    return (
      <View style={[styles.changeBadge, isPositive ? styles.changeBadgePositive : styles.changeBadgeNegative]}>
        <Text style={[styles.changeBadgeText, isPositive ? styles.changePositiveText : styles.changeNegativeText]}>
          {isPositive ? '↑' : '↓'} {Math.abs(pct)}% vs mes passado
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={handleRefresh}
            tintColor="#16A34A"
            colors={['#16A34A']}
          />
        }
      >
        {/* Header principal */}
        <View style={styles.header}>
          <Text style={styles.headerMonth}>{getCurrentMonthName()}</Text>
          <Text style={styles.headerLabel}>Voce ganhou este mes</Text>
          <Text style={styles.headerValue}>{formatCurrency(stats.revenue)}</Text>
          {renderChangeBadge()}
        </View>

        {/* Alerta de prejuizo */}
        {isNegativeProfit && !isEmpty && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>
              Atencao: suas despesas superam a receita este mes
            </Text>
          </View>
        )}

        {/* Conteudo principal */}
        <View style={styles.body}>
          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              {/* Cards de estatisticas */}
              <View style={styles.cardsRow}>
                <DashboardCard
                  emoji="🌿"
                  label="Servicos"
                  value={String(stats.servicesCompleted)}
                />
                <DashboardCard
                  emoji="💚"
                  label="Recebido"
                  value={formatCurrency(stats.revenue)}
                  valueColor="#16A34A"
                />
                <DashboardCard
                  emoji="⏳"
                  label="Pendente"
                  value={formatCurrency(stats.pendingTotal)}
                  valueColor="#D97706"
                />
              </View>

              {/* Barra de receita vs despesas */}
              {(stats.revenue > 0 || stats.expenses > 0) && (
                <RevenueBar
                  revenue={stats.revenue}
                  expenses={stats.expenses}
                  netProfit={stats.netProfit}
                />
              )}
            </>
          )}

          {/* Acoes */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButtonPrimary}
              onPress={() => router.push('/(tabs)/finance/new-expense')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonPrimaryText}>+ Nova despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonSecondary}
              onPress={() => router.push('/(tabs)/finance/pending')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonSecondaryText}>Ver pendentes</Text>
            </TouchableOpacity>
          </View>

          {/* Link para lista de despesas */}
          {!isEmpty && stats.expenses > 0 && (
            <TouchableOpacity
              style={styles.expensesLink}
              onPress={() => router.push('/(tabs)/finance/expenses')}
              activeOpacity={0.7}
            >
              <Text style={styles.expensesLinkText}>Ver todas as despesas deste mes</Text>
            </TouchableOpacity>
          )}
        </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerMonth: {
    fontSize: 13,
    color: '#BBF7D0',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerLabel: {
    fontSize: 15,
    color: '#D1FAE5',
    marginBottom: 8,
  },
  headerValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  changeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  changeBadgePositive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  changeBadgeNegative: {
    backgroundColor: 'rgba(220,38,38,0.25)',
  },
  changeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  changePositiveText: {
    color: '#ECFDF5',
  },
  changeNegativeText: {
    color: '#FEE2E2',
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: -4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '600',
  },
  body: {
    padding: 16,
    gap: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButtonPrimary: {
    flex: 1,
    height: 56,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  actionButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  expensesLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  expensesLinkText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
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
    marginBottom: 20,
  },
  emptyExample: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    width: '100%',
  },
  emptyExampleLabel: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emptyExampleValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 2,
  },
  emptyExampleDesc: {
    fontSize: 13,
    color: '#15803D',
  },
});
