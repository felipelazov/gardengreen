import { createClient } from '@/lib/supabase/server';
import { FinanceiroView } from '@/components/financial/FinanceiroView';

export default async function FinanceiroPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user!.id;

  // Last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [servicesRes, expensesRes] = await Promise.all([
    supabase
      .from('services')
      .select('id, title, price, scheduled_date, status, clients(name)')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('scheduled_date', sixMonthsAgo.toISOString().split('T')[0])
      .order('scheduled_date', { ascending: false }),
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sixMonthsAgo.toISOString().split('T')[0])
      .order('date', { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground text-sm">Receitas, despesas e lucro</p>
      </div>
      <FinanceiroView
        services={servicesRes.data ?? []}
        expenses={expensesRes.data ?? []}
      />
    </div>
  );
}
