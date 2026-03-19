'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Bell, CreditCard, AlertTriangle } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface ConfigViewProps {
  profile: any;
  notifPrefs: any;
}

const planInfo: Record<string, { name: string; price: string; features: string[] }> = {
  free: { name: 'Gratis', price: 'R$0', features: ['Agenda de clientes', 'Cobranca PIX', 'Relatorio basico'] },
  solo: { name: 'Solo', price: 'R$39/mes', features: ['Tudo do Gratis', 'Orcamentos ilimitados', 'Relatorio completo', 'Suporte prioritario'] },
  team: { name: 'Equipe', price: 'R$99/mes', features: ['Tudo do Solo', 'Ate 5 membros', 'Dashboard da equipe', 'Controle de rotas'] },
};

export function ConfigView({ profile, notifPrefs }: ConfigViewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    phone: profile?.phone ?? '',
    email: profile?.email ?? '',
    city: profile?.city ?? '',
    service_type: profile?.service_type ?? '',
    cnpj_mei: profile?.cnpj_mei ?? '',
    address: profile?.address ?? '',
  });

  const [notifs, setNotifs] = useState({
    morning_reminder: notifPrefs?.morning_reminder ?? true,
    overdue_alert: notifPrefs?.overdue_alert ?? true,
    monthly_report: notifPrefs?.monthly_report ?? true,
    weekly_summary: notifPrefs?.weekly_summary ?? false,
  });

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const plan = planInfo[profile?.plan ?? 'free'] ?? planInfo.free;
  const completion = profile?.profile_completion ?? 0;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('users').update(form).eq('id', profile.id);
    setSaving(false);
    router.refresh();
  }

  async function toggleNotif(key: string, value: boolean) {
    const updated = { ...notifs, [key]: value };
    setNotifs(updated);
    await supabase.from('notification_preferences').update({ [key]: value }).eq('user_id', profile.id);
  }

  async function deleteAccount() {
    if (deleteConfirm !== profile?.name) return;
    if (!confirm('CONFIRMAR: Excluir conta permanentemente?')) return;
    await supabase.from('users').update({ status: 'deleted' }).eq('id', profile.id);
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile completion */}
      <div className="bg-primary-light rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Perfil {completion}% completo</span>
        </div>
        <div className="w-full bg-primary-light-mid rounded-full h-2">
          <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${completion}%` }} />
        </div>
      </div>

      {/* Account form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-5 w-5" />Dados da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Nome *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Telefone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Cidade</label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Tipo de Servico</label>
                <Input value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} placeholder="Jardinagem residencial" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">CNPJ/MEI</label>
                <Input value={form.cnpj_mei} onChange={(e) => setForm({ ...form, cnpj_mei: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Endereco</label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alteracoes'}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-5 w-5" />Meu Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="default">{plan.name}</Badge>
            <span className="text-lg font-bold">{plan.price}</span>
          </div>
          <ul className="space-y-1 mb-4">
            {plan.features.map((f) => (
              <li key={f} className="text-sm text-muted-foreground">✓ {f}</li>
            ))}
          </ul>
          {profile?.plan !== 'team' && (
            <Button variant="outline">Fazer upgrade</Button>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-5 w-5" />Notificacoes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { key: 'morning_reminder', label: 'Lembrete matinal', desc: 'Receba um resumo dos servicos do dia' },
            { key: 'overdue_alert', label: 'Alerta de cobranca vencida', desc: 'Aviso quando uma cobranca vencer' },
            { key: 'monthly_report', label: 'Relatorio mensal', desc: 'Resumo financeiro do mes' },
            { key: 'weekly_summary', label: 'Resumo semanal', desc: 'Servicos da proxima semana' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(item.key, !(notifs as any)[item.key])}
                className={`relative w-11 h-6 rounded-full transition-colors ${(notifs as any)[item.key] ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${(notifs as any)[item.key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" />Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={signOut}>
            <Button variant="outline" type="submit">Sair de todos os dispositivos</Button>
          </form>
          <div className="border-t border-border pt-4">
            <p className="text-sm text-red-600 font-medium mb-2">Excluir conta permanentemente</p>
            <p className="text-xs text-muted-foreground mb-3">Todos os seus dados serao apagados. Esta acao nao pode ser desfeita.</p>
            <div className="flex gap-2">
              <Input
                placeholder={`Digite "${profile?.name}" para confirmar`}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="flex-1"
              />
              <Button variant="destructive" disabled={deleteConfirm !== profile?.name} onClick={deleteAccount}>
                Excluir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
