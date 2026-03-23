'use client';

import { MetricCard } from '@/components/ui/metric-card';
import { DollarSign, CheckCircle, Users, FileText } from 'lucide-react';

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const pct = ((current - previous) / previous) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

interface MetricsCardsProps {
  metrics: {
    revenue: number;
    prevRevenue: number;
    servicesCount: number;
    prevServicesCount: number;
    clientsCount: number;
    pendingQuotes: number;
    expenses: number;
    prevExpenses: number;
  };
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Receita do mes',
      value: formatBRL(metrics.revenue),
      change: `${pctChange(metrics.revenue, metrics.prevRevenue)} vs mes anterior`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Servicos realizados',
      value: metrics.servicesCount.toString(),
      change: `${pctChange(metrics.servicesCount, metrics.prevServicesCount)} vs mes anterior`,
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Clientes ativos',
      value: metrics.clientsCount.toString(),
      change: undefined,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Orcamentos pendentes',
      value: metrics.pendingQuotes.toString(),
      change: undefined,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.title}
          title={card.title}
          value={card.value}
          change={card.change}
          icon={card.icon}
          color={card.color}
          bg={card.bg}
        />
      ))}
    </div>
  );
}
