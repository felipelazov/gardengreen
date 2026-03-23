import { createClient } from '@/lib/supabase/server';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';

const emptyMetrics = {
  revenue: 0, prevRevenue: 0, servicesCount: 0, prevServicesCount: 0,
  clientsCount: 0, pendingQuotes: 0, expenses: 0, prevExpenses: 0,
};
const emptyAlerts = { overdue: [] as { id: string; clientName: string }[], oldQuotes: [] as { id: string; clientName: string }[] };

async function safeQuery(query: PromiseLike<any>) {
  try {
    const result = await query;
    return result;
  } catch {
    return { data: null, count: null, error: 'query failed' };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const userId = user.id;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

  // Each query isolated — one failure doesn't break others
  const todayServicesRes = await safeQuery(
    supabase.from('services').select('*, clients(name, phone, address)').eq('user_id', userId).eq('scheduled_date', today).order('start_time')
  );
  const monthServicesRes = await safeQuery(
    supabase.from('services').select('price, status').eq('user_id', userId).gte('scheduled_date', startOfMonth).lte('scheduled_date', endOfMonth)
  );
  const prevMonthServicesRes = await safeQuery(
    supabase.from('services').select('price, status').eq('user_id', userId).gte('scheduled_date', startOfPrevMonth).lte('scheduled_date', endOfPrevMonth)
  );
  const clientsRes = await safeQuery(
    supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active')
  );
  const pendingQuotesRes = await safeQuery(
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('status', ['draft', 'sent'])
  );
  const overdueRes = await safeQuery(
    supabase.from('services').select('id, clients(name)').eq('user_id', userId).eq('payment_status', 'overdue')
  );
  const oldQuotesRes = await safeQuery(
    supabase.from('quotes').select('id, clients(name)').eq('user_id', userId).eq('status', 'sent').lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
  );
  const monthExpensesRes = await safeQuery(
    supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', startOfMonth).lte('date', endOfMonth)
  );
  const prevMonthExpensesRes = await safeQuery(
    supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', startOfPrevMonth).lte('date', endOfPrevMonth)
  );

  const todayServices = todayServicesRes.data ?? [];
  const completedServices = (monthServicesRes.data ?? []).filter((s: any) => s.status === 'completed');
  const prevCompletedServices = (prevMonthServicesRes.data ?? []).filter((s: any) => s.status === 'completed');
  const revenue = completedServices.reduce((sum: number, s: any) => sum + (s.price ?? 0), 0);
  const prevRevenue = prevCompletedServices.reduce((sum: number, s: any) => sum + (s.price ?? 0), 0);
  const expenses = (monthExpensesRes.data ?? []).reduce((sum: number, e: any) => sum + (e.amount ?? 0), 0);
  const prevExpenses = (prevMonthExpensesRes.data ?? []).reduce((sum: number, e: any) => sum + (e.amount ?? 0), 0);

  const metrics = {
    revenue, prevRevenue,
    servicesCount: completedServices.length,
    prevServicesCount: prevCompletedServices.length,
    clientsCount: clientsRes.count ?? 0,
    pendingQuotes: pendingQuotesRes.count ?? 0,
    expenses, prevExpenses,
  };

  const alerts = {
    overdue: (overdueRes.data ?? []).map((s: any) => ({ id: s.id, clientName: s.clients?.name ?? 'Cliente' })),
    oldQuotes: (oldQuotesRes.data ?? []).map((q: any) => ({ id: q.id, clientName: q.clients?.name ?? 'Cliente' })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral do seu dia</p>
      </div>

      <MetricsCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaySchedule services={todayServices} />
        </div>
        <div>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
