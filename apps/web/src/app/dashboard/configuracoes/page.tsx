import { createClient } from '@/lib/supabase/server';
import { ConfigView } from '@/components/settings/ConfigView';

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Carregando...</div>;
  }

  let profile: any = null;
  let notifPrefs: any = null;

  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  } catch {
    // Graceful fallback
  }

  try {
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    notifPrefs = data;
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-muted-foreground text-sm">Gerencie sua conta e preferencias</p>
      </div>
      <ConfigView profile={profile} notifPrefs={notifPrefs} />
    </div>
  );
}
