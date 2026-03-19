import { createClient } from '@/lib/supabase/server';
import { ClientsView } from '@/components/clients/ClientsView';

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: clients, count } = await supabase
    .from('clients')
    .select('*, services(id)', { count: 'exact' })
    .eq('user_id', user!.id)
    .order('name')
    .range(0, 19);

  const clientsWithCount = (clients ?? []).map((c: any) => ({
    ...c,
    services_count: Array.isArray(c.services) ? c.services.length : 0,
    services: undefined,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-muted-foreground text-sm">{count ?? 0} clientes cadastrados</p>
      </div>
      <ClientsView initialClients={clientsWithCount} totalCount={count ?? 0} />
    </div>
  );
}
