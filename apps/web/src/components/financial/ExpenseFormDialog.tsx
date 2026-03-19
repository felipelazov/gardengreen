'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export function ExpenseFormDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('expenses').insert({
      user_id: user!.id,
      description: form.description,
      amount: parseFloat(form.amount) || 0,
      date: form.date,
      category: form.category,
    });
    router.refresh();
    onClose();
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-xl w-full max-w-sm p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Nova Despesa</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Descricao *</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Valor (R$) *</label>
            <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Data</label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Categoria</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="fuel">Combustivel</option>
              <option value="tools">Ferramentas</option>
              <option value="supplies">Insumos</option>
              <option value="maintenance">Manutencao</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Salvando...' : 'Registrar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
