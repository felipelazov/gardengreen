import { createClient } from '@/lib/supabase/server';
import { QuotesView } from '@/components/quotes/QuotesView';

export default async function OrcamentosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: quotes, count } = await supabase
    .from('quotes')
    .select('*, clients(name, phone)', { count: 'exact' })
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .range(0, 19);

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, phone')
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Orcamentos</h1>
        <p className="text-muted-foreground text-sm">{count ?? 0} orcamentos</p>
      </div>
      <QuotesView initialQuotes={quotes ?? []} totalCount={count ?? 0} clients={clients ?? []} />
    </div>
  );
}
