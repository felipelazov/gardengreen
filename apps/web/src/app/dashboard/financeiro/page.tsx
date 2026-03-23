import { createClient } from '@/lib/supabase/server';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

function FinanceiroLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded" />
            ))}
          </div>
          <div className="h-[300px] bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

const FinanceiroView = dynamic(
  () => import('@/components/financial/FinanceiroView').then(mod => ({ default: mod.FinanceiroView })),
  { ssr: false, loading: () => <FinanceiroLoading /> }
);

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
