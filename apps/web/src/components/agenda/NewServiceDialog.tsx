'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

interface NewServiceDialogProps {
  clients: { id: string; name: string; phone: string }[];
  defaultDate: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewServiceDialog({ clients, defaultDate, open, onOpenChange }: NewServiceDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    client_id: '',
    title: 'Manutencao de jardim',
    scheduled_date: defaultDate ?? new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '10:00',
    price: '',
    notes: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('services').insert({
      ...form,
      price: parseFloat(form.price) || 0,
      notes: form.notes || null,
      user_id: user!.id,
      status: 'scheduled',
      payment_status: 'pending',
    });

    if (error) {
      toast('Erro ao criar servico. Tente novamente.', 'error');
    } else {
      toast('Servico agendado com sucesso!', 'success');
      router.refresh();
      onOpenChange(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Servico</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="service-client" className="text-sm font-medium block mb-1">Cliente *</label>
            <Select value={form.client_id} onValueChange={(value) => setForm({ ...form, client_id: value })}>
              <SelectTrigger id="service-client" aria-label="Cliente">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="service-title" className="text-sm font-medium block mb-1">Tipo de servico</label>
            <Input id="service-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="service-date" className="text-sm font-medium block mb-1">Data *</label>
            <Input id="service-date" type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="service-start" className="text-sm font-medium block mb-1">Inicio</label>
              <Input id="service-start" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            </div>
            <div>
              <label htmlFor="service-end" className="text-sm font-medium block mb-1">Fim</label>
              <Input id="service-end" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
            </div>
          </div>
          <div>
            <label htmlFor="service-price" className="text-sm font-medium block mb-1">Valor (R$)</label>
            <Input id="service-price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150.00" />
          </div>
          <div>
            <label htmlFor="service-notes" className="text-sm font-medium block mb-1">Notas</label>
            <textarea
              id="service-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              placeholder="Observacoes sobre o servico..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
