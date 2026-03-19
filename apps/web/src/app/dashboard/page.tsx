import { createClient } from '@/lib/supabase/server';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user!.id;

  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
  const startOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0];
  const endOfPrevMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0];

  // Fetch all data in parallel
  const [
    todayServicesRes,
    monthServicesRes,
    prevMonthServicesRes,
    clientsRes,
    pendingQuotesRes,
    overdueRes,
    oldQuotesRes,
    monthExpensesRes,
    prevMonthExpensesRes,
  ] = await Promise.all([
    supabase.from('services').select('*, clients(name, phone, address)').eq('user_id', userId).eq('scheduled_date', today).order('start_time'),
    supabase.from('services').select('price, status').eq('user_id', userId).gte('scheduled_date', startOfMonth).lte('scheduled_date', endOfMonth),
    supabase.from('services').select('price, status').eq('user_id', userId).gte('scheduled_date', startOfPrevMonth).lte('scheduled_date', endOfPrevMonth),
    supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active'),
    supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', userId).in('status', ['draft', 'sent']),
    supabase.from('services').select('id, clients(name)').eq('user_id', userId).eq('payment_status', 'overdue'),
    supabase.from('quotes').select('id, clients(name)').eq('user_id', userId).eq('status', 'sent').lt('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', startOfMonth).lte('date', endOfMonth),
    supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', startOfPrevMonth).lte('date', endOfPrevMonth),
  ]);

  const completedServices = (monthServicesRes.data ?? []).filter(s => s.status === 'completed');
  const prevCompletedServices = (prevMonthServicesRes.data ?? []).filter(s => s.status === 'completed');
  const revenue = completedServices.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const prevRevenue = prevCompletedServices.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const expenses = (monthExpensesRes.data ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const prevExpenses = (prevMonthExpensesRes.data ?? []).reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const metrics = {
    revenue,
    prevRevenue,
    servicesCount: completedServices.length,
    prevServicesCount: prevCompletedServices.length,
    clientsCount: clientsRes.count ?? 0,
    pendingQuotes: pendingQuotesRes.count ?? 0,
    expenses,
    prevExpenses,
  };

  const alerts = {
    overdue: (overdueRes.data ?? []).map(s => ({ id: s.id, clientName: (s.clients as any)?.name ?? 'Cliente' })),
    oldQuotes: (oldQuotesRes.data ?? []).map(q => ({ id: q.id, clientName: (q.clients as any)?.name ?? 'Cliente' })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visao geral do seu dia</p>
      </div>

      <MetricsCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaySchedule services={todayServicesRes.data ?? []} />
        </div>
        <div>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
