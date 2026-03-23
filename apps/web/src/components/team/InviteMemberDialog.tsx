'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('users').select('team_id').eq('id', user!.id).single();

    if (!profile?.team_id) {
      toast('Erro: equipe nao encontrada.', 'error');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('team_members').insert({
      team_id: profile.team_id,
      user_id: user!.id, // placeholder — in production, would create invite flow
      role: 'member',
      status: 'invited',
    });

    if (error) {
      toast('Erro ao convidar membro.', 'error');
    } else {
      toast('Convite enviado com sucesso!', 'success');
      router.refresh();
      onOpenChange(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Convidar Membro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="member-name" className="text-sm font-medium block mb-1">Nome *</label>
            <Input id="member-name" aria-label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="member-phone" className="text-sm font-medium block mb-1">Telefone *</label>
            <Input id="member-phone" aria-label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="member-email" className="text-sm font-medium block mb-1">Email</label>
            <Input id="member-email" aria-label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Enviando...' : 'Convidar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
