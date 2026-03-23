'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

interface ClientFormDialogProps {
  client: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    neighborhood: string | null;
    city: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientFormDialog({ client, open, onOpenChange }: ClientFormDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const isEdit = !!client;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: client?.name ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    address: client?.address ?? '',
    neighborhood: client?.neighborhood ?? '',
    city: client?.city ?? '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const payload = { ...form, email: form.email || null, user_id: user!.id };

    if (isEdit) {
      await supabase.from('clients').update(payload).eq('id', client!.id);
    } else {
      await supabase.from('clients').insert(payload);
    }

    setLoading(false);
    toast(isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!', 'success');
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="client-name" className="text-sm font-medium block mb-1">Nome *</label>
            <Input id="client-name" aria-label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="client-phone" className="text-sm font-medium block mb-1">Telefone *</label>
            <Input id="client-phone" aria-label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="client-email" className="text-sm font-medium block mb-1">Email</label>
            <Input id="client-email" aria-label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label htmlFor="client-address" className="text-sm font-medium block mb-1">Endereco</label>
            <Input id="client-address" aria-label="Endereco" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="client-neighborhood" className="text-sm font-medium block mb-1">Bairro</label>
              <Input id="client-neighborhood" aria-label="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
            </div>
            <div>
              <label htmlFor="client-city" className="text-sm font-medium block mb-1">Cidade</label>
              <Input id="client-city" aria-label="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
