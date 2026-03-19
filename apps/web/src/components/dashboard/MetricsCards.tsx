import { Card, CardContent } from '@/components/ui/card';
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
      change: pctChange(metrics.revenue, metrics.prevRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Servicos realizados',
      value: metrics.servicesCount.toString(),
      change: pctChange(metrics.servicesCount, metrics.prevServicesCount),
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Clientes ativos',
      value: metrics.clientsCount.toString(),
      change: null,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Orcamentos pendentes',
      value: metrics.pendingQuotes.toString(),
      change: null,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                {card.change && (
                  <p className={`text-xs mt-1 ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {card.change} vs mes anterior
                  </p>
                )}
              </div>
              <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
