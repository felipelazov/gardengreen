import { createClient } from '@/lib/supabase/server';
import { EquipeView } from '@/components/team/EquipeView';

export default async function EquipePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Carregando...</div>;
  }

  let profile: any = null;
  try {
    const { data } = await supabase.from('users').select('plan, team_id').eq('id', user.id).single();
    profile = data;
  } catch {
    // Graceful fallback
  }

  if (profile?.plan !== 'team') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua equipe</p>
        </div>
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">👥</span>
          <h2 className="text-xl font-bold mb-2">Plano Equipe</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Gerencie sua equipe de jardineiros, atribua servicos e acompanhe a produtividade de cada membro.
          </p>
          <a href="/dashboard/configuracoes" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Fazer upgrade para Equipe — R$99/mes
          </a>
        </div>
      </div>
    );
  }

  let members: any[] = [];
  try {
    const { data } = await supabase
      .from('team_members')
      .select('*, users(name, phone, avatar_url)')
      .eq('team_id', profile.team_id);
    members = data ?? [];
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
        <p className="text-muted-foreground text-sm">{members.length} membros</p>
      </div>
      <EquipeView members={members} />
    </div>
  );
}
