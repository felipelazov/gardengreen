import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';

import { ExpenseModel } from '@/database/models/Expense';
import { PaymentModel } from '@/database/models/Payment';
import type { CreateExpenseInput } from '@shared/schemas/expenseSchema';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function startOfMonth(month: number, year: number): number {
  return new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
}

function endOfMonth(month: number, year: number): number {
  return new Date(year, month, 0, 23, 59, 59, 999).getTime();
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// useMonthlyRevenue — soma dos pagamentos recebidos no mes
// ---------------------------------------------------------------------------
export function useMonthlyRevenue(userId: string, month: number, year: number) {
  const database = useDatabase();
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const collection = database.get<PaymentModel>('payments');
      const start = startOfMonth(month, year);
      const end = endOfMonth(month, year);
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('status', 'paid'),
          Q.where('paid_at', Q.gte(start)),
          Q.where('paid_at', Q.lte(end)),
        )
        .fetch();
      const sum = results.reduce((acc, p) => acc + (p.amount ?? 0), 0);
      setRevenue(sum);
    } catch (err) {
      console.error('useMonthlyRevenue error:', err);
      setRevenue(0);
    } finally {
      setLoading(false);
    }
  }, [database, userId, month, year]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { revenue, loading, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useMonthlyExpenses — soma das despesas do mes
// ---------------------------------------------------------------------------
export function useMonthlyExpenses(userId: string, month: number, year: number) {
  const database = useDatabase();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const collection = database.get<ExpenseModel>('expenses');
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('date', Q.like(`${monthStr}%`)),
        )
        .fetch();
      const sum = results.reduce((acc, e) => acc + (e.amount ?? 0), 0);
      setTotal(sum);
    } catch (err) {
      console.error('useMonthlyExpenses error:', err);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [database, userId, month, year]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { total, loading, refetch: fetch };
}

// ---------------------------------------------------------------------------
// MonthlyStats — tipo de retorno combinado
// ---------------------------------------------------------------------------
export interface MonthlyStats {
  revenue: number;
  expenses: number;
  netProfit: number;
  servicesCompleted: number;
  clientsServed: number;
  pendingTotal: number;
  previousMonthRevenue: number;
  revenueChangePercent: number | null;
}

// ---------------------------------------------------------------------------
// useMonthlyStats — dados combinados para o dashboard
// ---------------------------------------------------------------------------
export function useMonthlyStats(userId: string) {
  const database = useDatabase();
  const [stats, setStats] = useState<MonthlyStats>({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    servicesCompleted: 0,
    clientsServed: 0,
    pendingTotal: 0,
    previousMonthRevenue: 0,
    revenueChangePercent: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const fetch = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const paymentsCollection = database.get<PaymentModel>('payments');
      const expensesCollection = database.get<ExpenseModel>('expenses');

      const start = startOfMonth(month, year);
      const end = endOfMonth(month, year);
      const prevStart = startOfMonth(prevMonth, prevYear);
      const prevEnd = endOfMonth(prevMonth, prevYear);
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

      const [paidPayments, pendingPayments, prevPaidPayments, expenses, prevExpenses] =
        await Promise.all([
          paymentsCollection
            .query(
              Q.where('user_id', userId),
              Q.where('status', 'paid'),
              Q.where('paid_at', Q.gte(start)),
              Q.where('paid_at', Q.lte(end)),
            )
            .fetch(),
          paymentsCollection
            .query(Q.where('user_id', userId), Q.where('status', 'pending'))
            .fetch(),
          paymentsCollection
            .query(
              Q.where('user_id', userId),
              Q.where('status', 'paid'),
              Q.where('paid_at', Q.gte(prevStart)),
              Q.where('paid_at', Q.lte(prevEnd)),
            )
            .fetch(),
          expensesCollection
            .query(
              Q.where('user_id', userId),
              Q.where('date', Q.like(`${monthStr}%`)),
            )
            .fetch(),
          expensesCollection
            .query(
              Q.where('user_id', userId),
              Q.where('date', Q.like(`${prevMonthStr}%`)),
            )
            .fetch(),
        ]);

      const revenue = paidPayments.reduce((acc, p) => acc + (p.amount ?? 0), 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount ?? 0), 0);
      const pendingTotal = pendingPayments.reduce((acc, p) => acc + (p.amount ?? 0), 0);
      const previousMonthRevenue = prevPaidPayments.reduce((acc, p) => acc + (p.amount ?? 0), 0);

      const serviceIds = new Set(paidPayments.map((p) => p.serviceId).filter(Boolean));
      const clientIds = new Set(paidPayments.map((p) => p.clientId).filter(Boolean));

      let revenueChangePercent: number | null = null;
      if (previousMonthRevenue > 0) {
        revenueChangePercent = Math.round(((revenue - previousMonthRevenue) / previousMonthRevenue) * 100);
      }

      setStats({
        revenue,
        expenses: totalExpenses,
        netProfit: revenue - totalExpenses,
        servicesCompleted: serviceIds.size,
        clientsServed: clientIds.size,
        pendingTotal,
        previousMonthRevenue,
        revenueChangePercent,
      });
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      console.error('useMonthlyStats error:', err);
    } finally {
      setLoading(false);
    }
  }, [database, userId, month, year, prevMonth, prevYear]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useCreateExpense — criar despesa no WatermelonDB
// ---------------------------------------------------------------------------
export function useCreateExpense() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createExpense = useCallback(
    async (userId: string, input: CreateExpenseInput): Promise<ExpenseModel> => {
      setLoading(true);
      setError(null);

      try {
        let expense!: ExpenseModel;
        await database.write(async () => {
          expense = await database.get<ExpenseModel>('expenses').create((e) => {
            e.userId = userId;
            e.description = input.description;
            e.amount = input.amount;
            e.category = input.category;
            e.date = input.date;
          });
        });
        return expense;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { createExpense, loading, error };
}

// ---------------------------------------------------------------------------
// useExpenses — listar despesas de um mes
// ---------------------------------------------------------------------------
export function useExpenses(userId: string, month: number, year: number) {
  const database = useDatabase();
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const collection = database.get<ExpenseModel>('expenses');
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('date', Q.like(`${monthStr}%`)),
          Q.sortBy('date', Q.desc),
        )
        .fetch();
      setExpenses(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('useExpenses error:', err);
    } finally {
      setLoading(false);
    }
  }, [database, userId, month, year]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { expenses, loading, error, refetch: fetch };
}
