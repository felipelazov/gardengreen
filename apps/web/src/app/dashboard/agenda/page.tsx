import { createClient } from '@/lib/supabase/server';
import { AgendaView } from '@/components/agenda/AgendaView';

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch services for the current month ± 1 month for calendar navigation
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const end = new Date();
  end.setMonth(end.getMonth() + 2);

  const { data: services } = await supabase
    .from('services')
    .select('*, clients(id, name, phone, address)')
    .eq('user_id', user!.id)
    .gte('scheduled_date', start.toISOString().split('T')[0])
    .lte('scheduled_date', end.toISOString().split('T')[0])
    .order('scheduled_date');

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, phone')
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .order('name');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus servicos</p>
      </div>
      <AgendaView initialServices={services ?? []} clients={clients ?? []} />
    </div>
  );
}
