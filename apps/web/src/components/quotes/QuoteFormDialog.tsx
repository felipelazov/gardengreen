'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Plus, Trash2 } from 'lucide-react';

interface QuoteFormDialogProps {
  clients: { id: string; name: string; phone: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function QuoteFormDialog({ clients, open, onOpenChange }: QuoteFormDialogProps) {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  function addItem() {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof QuoteItem, value: string | number) {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const description = items.map((i) => `${i.quantity}x ${i.description} - R$${(i.quantity * i.unit_price).toFixed(2)}`).join('\n');

    const { error } = await supabase.from('quotes').insert({
      user_id: user!.id,
      client_id: clientId,
      description,
      total_amount: total,
      notes: notes || null,
      status: 'draft',
      valid_until: new Date(Date.now() + validDays * 86400000).toISOString().split('T')[0],
    });

    if (error) {
      toast('Erro ao criar orcamento.', 'error');
    } else {
      toast('Orcamento criado com sucesso!', 'success');
      router.refresh();
      onOpenChange(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Orcamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quote-client" className="text-sm font-medium block mb-1">Cliente *</label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="quote-client" aria-label="Cliente">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Itens</label>
              <Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Input placeholder="Descricao" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="flex-1" />
                  <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)} className="w-16" />
                  <Input type="number" step="0.01" placeholder="R$" value={item.unit_price || ''} onChange={(e) => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)} className="w-24" />
                  <button type="button" onClick={() => removeItem(i)} className="p-2 hover:bg-muted rounded-lg" disabled={items.length === 1}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-green-700">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
            </span>
          </div>

          <div>
            <label htmlFor="quote-valid-days" className="text-sm font-medium block mb-1">Validade (dias)</label>
            <Input id="quote-valid-days" type="number" value={validDays} onChange={(e) => setValidDays(parseInt(e.target.value) || 30)} />
          </div>

          <div>
            <label htmlFor="quote-notes" className="text-sm font-medium block mb-1">Observacoes</label>
            <textarea id="quote-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Salvando...' : 'Criar Orcamento'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
