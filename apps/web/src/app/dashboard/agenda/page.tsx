import { createClient } from '@/lib/supabase/server';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

function AgendaLoading() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-[400px] bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

const AgendaView = dynamic(
  () => import('@/components/agenda/AgendaView').then(mod => ({ default: mod.AgendaView })),
  { ssr: false, loading: () => <AgendaLoading /> }
);

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Fetch services for the current month ± 1 month for calendar navigation
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const end = new Date();
  end.setMonth(end.getMonth() + 2);

  let services: any[] = [];
  let clients: any[] = [];
  try {
    const servicesRes = await supabase
      .from('services')
      .select('*, clients(id, name, phone, address)')
      .eq('user_id', user.id)
      .gte('scheduled_date', start.toISOString().split('T')[0])
      .lte('scheduled_date', end.toISOString().split('T')[0])
      .order('scheduled_date');
    services = servicesRes.data ?? [];
  } catch {
    // Graceful fallback
  }

  try {
    const clientsRes = await supabase
      .from('clients')
      .select('id, name, phone')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('name');
    clients = clientsRes.data ?? [];
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus servicos</p>
      </div>
      <AgendaView initialServices={services} clients={clients} />
    </div>
  );
}
