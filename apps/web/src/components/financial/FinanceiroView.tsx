'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/ui/metric-card';
import { DollarSign, TrendingUp, TrendingDown, Download, Plus } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { ExpenseFormDialog } from './ExpenseFormDialog';

interface ServiceRow {
  id: string;
  title: string;
  price: number;
  scheduled_date: string;
  status: string;
  clients: { name: string } | { name: string }[] | null;
}

interface ExpenseRow {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const COLORS = ['#16A34A', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const categoryLabels: Record<string, string> = {
  fuel: 'Combustivel', tools: 'Ferramentas', supplies: 'Insumos', maintenance: 'Manutencao', other: 'Outros',
};

function formatBRL(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export function FinanceiroView({ services, expenses }: { services: ServiceRow[]; expenses: ExpenseRow[] }) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const totalRevenue = services.reduce((s, r) => s + (r.price ?? 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);
  const profit = totalRevenue - totalExpenses;
  const avgTicket = services.length > 0 ? totalRevenue / services.length : 0;

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; receita: number; despesa: number }> = {};
    services.forEach((s) => {
      const m = s.scheduled_date.slice(0, 7);
      if (!months[m]) months[m] = { month: m, receita: 0, despesa: 0 };
      months[m].receita += s.price ?? 0;
    });
    expenses.forEach((e) => {
      const m = e.date.slice(0, 7);
      if (!months[m]) months[m] = { month: m, receita: 0, despesa: 0 };
      months[m].despesa += e.amount ?? 0;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).map(d => ({
      ...d,
      month: new Date(d.month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
    }));
  }, [services, expenses]);

  // Revenue by service type for pie chart
  const byType = useMemo(() => {
    const types: Record<string, number> = {};
    services.forEach((s) => {
      const t = s.title || 'Outros';
      types[t] = (types[t] ?? 0) + (s.price ?? 0);
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [services]);

  function exportCSV() {
    const header = 'Data;Tipo;Descricao;Cliente;Categoria;Valor\n';
    const revenueRows = services.map((s) =>
      `${s.scheduled_date};Receita;${s.title};${(s.clients as any)?.name ?? ''};Servico;${s.price.toFixed(2).replace('.', ',')}`
    );
    const expenseRows = expenses.map((e) =>
      `${e.date};Despesa;${e.description};;${categoryLabels[e.category] ?? e.category};${e.amount.toFixed(2).replace('.', ',')}`
    );
    const csv = header + [...revenueRows, ...expenseRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro_${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const summaryCards = [
    { title: 'Receita total', value: formatBRL(totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Despesas totais', value: formatBRL(totalExpenses), icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Lucro liquido', value: formatBRL(profit), icon: TrendingUp, color: profit >= 0 ? 'text-green-600' : 'text-red-600', bg: profit >= 0 ? 'bg-green-50' : 'bg-red-50' },
    { title: 'Ticket medio', value: formatBRL(avgTicket), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <MetricCard
            key={c.title}
            title={c.title}
            value={c.value}
            icon={c.icon}
            color={c.color}
            bg={c.bg}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Receitas vs Despesas</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-muted-foreground)' }} stroke="var(--color-border)" />
                <YAxis tick={{ fill: 'var(--color-muted-foreground)' }} stroke="var(--color-border)" />
                <Tooltip formatter={(v) => formatBRL(Number(v))} contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-foreground)' }} />
                <Legend wrapperStyle={{ color: 'var(--color-foreground)' }} />
                <Bar dataKey="receita" name="Receita" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Receita por Tipo de Servico</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name }) => name}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatBRL(Number(v))} contentStyle={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-foreground)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={() => setShowExpenseForm(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nova Despesa
        </Button>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Exportar CSV
        </Button>
      </div>

      {/* Transactions table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Ultimas Transacoes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted sticky top-0 z-10">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Data</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Descricao</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...services.slice(0, 10).map((s) => ({
                    date: s.scheduled_date,
                    type: 'receita' as const,
                    desc: `${(s.clients as any)?.name ?? ''} - ${s.title}`,
                    amount: s.price,
                  })),
                  ...expenses.slice(0, 10).map((e) => ({
                    date: e.date,
                    type: 'despesa' as const,
                    desc: `${e.description} (${categoryLabels[e.category] ?? e.category})`,
                    amount: e.amount,
                  })),
                ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15).map((t, i) => (
                  <tr key={i} className="border-b border-border hover:bg-muted/50 transition-all duration-150">
                    <td className="p-3 text-sm">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3"><Badge variant={t.type === 'receita' ? 'success' : 'destructive'}>{t.type === 'receita' ? 'Receita' : 'Despesa'}</Badge></td>
                    <td className="p-3 text-sm truncate max-w-[250px]">{t.desc}</td>
                    <td className={`p-3 text-right font-bold text-sm ${t.type === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'despesa' ? '- ' : ''}{formatBRL(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ExpenseFormDialog open={showExpenseForm} onOpenChange={setShowExpenseForm} />
    </>
  );
}
