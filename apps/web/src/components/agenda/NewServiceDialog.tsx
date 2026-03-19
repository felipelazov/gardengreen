'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface NewServiceDialogProps {
  clients: { id: string; name: string; phone: string }[];
  defaultDate: string | null;
  onClose: () => void;
}

export function NewServiceDialog({ clients, defaultDate, onClose }: NewServiceDialogProps) {
  const router = useRouter();
  const supabase = createClient();
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
      alert('Erro ao criar servico. Tente novamente.');
    } else {
      router.refresh();
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Novo Servico</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Cliente *</label>
            <select
              value={form.client_id}
              onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              required
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Tipo de servico</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Data *</label>
            <Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Inicio</label>
              <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Fim</label>
              <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Valor (R$)</label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="150.00" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              placeholder="Observacoes sobre o servico..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Agendar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
