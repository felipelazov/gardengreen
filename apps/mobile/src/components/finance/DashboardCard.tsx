import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardCardProps {
  emoji: string;
  label: string;
  value: string;
  /** Opcional: texto de tendencia, ex: "+15%" */
  trend?: string;
  /** Cor da tendencia: 'positive' (verde) | 'negative' (vermelho) | 'neutral' */
  trendDirection?: 'positive' | 'negative' | 'neutral';
  /** Cor de destaque do valor */
  valueColor?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DashboardCard({
  emoji,
  label,
  value,
  trend,
  trendDirection = 'neutral',
  valueColor = '#111827',
}: DashboardCardProps) {
  const trendColor =
    trendDirection === 'positive'
      ? '#16A34A'
      : trendDirection === 'negative'
        ? '#DC2626'
        : '#6B7280';

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {trend ? (
        <Text style={[styles.trend, { color: trendColor }]}>{trend}</Text>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: 100,
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
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  trend: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
