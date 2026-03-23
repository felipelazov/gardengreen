'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, statusMap } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { Plus, Send, Copy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { QuoteFormDialog } from './QuoteFormDialog';
import type { Status } from '@/components/ui/status-badge';

interface Quote {
  id: string;
  description: string;
  total_amount: number;
  status: string;
  valid_until: string | null;
  created_at: string;
  clients: { name: string; phone: string } | null;
}

const filterLabels: Record<string, string> = {
  all: 'Todos',
  draft: 'Rascunho',
  sent: 'Enviado',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export function QuotesView({ initialQuotes, totalCount, clients }: { initialQuotes: Quote[]; totalCount: number; clients: { id: string; name: string; phone: string }[] }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [batchPending, setBatchPending] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return initialQuotes;
    return initialQuotes.filter((q) => q.status === statusFilter);
  }, [initialQuotes, statusFilter]);

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }

  function sendWhatsApp(quote: Quote) {
    const phone = (quote.clients?.phone ?? '').replace(/\D/g, '');
    const msg = `Orcamento GardenGreen\n\n${quote.description}\n\nTotal: R$ ${quote.total_amount.toFixed(2)}\n\nValido ate: ${quote.valid_until ?? 'N/A'}`;
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    supabase.from('quotes').update({ status: 'sent' }).eq('id', quote.id).then(() => router.refresh());
  }

  async function duplicateQuote(quote: Quote) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('quotes').insert({
      user_id: user!.id,
      client_id: quote.id, // will need proper client_id
      description: quote.description,
      total_amount: quote.total_amount,
      status: 'draft',
      valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
    toast('Orcamento duplicado!', 'success');
    router.refresh();
  }

  function requestBatchAction(action: string) {
    if (selectedIds.size === 0) return;
    setBatchPending(action);
    setConfirmOpen(true);
  }

  async function executeBatchAction() {
    if (!batchPending || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    if (batchPending === 'delete') {
      await supabase.from('quotes').delete().in('id', ids);
      toast(`${ids.length} orcamento(s) excluido(s).`, 'success');
    } else {
      await supabase.from('quotes').update({ status: batchPending }).in('id', ids);
      toast(`${ids.length} orcamento(s) atualizado(s).`, 'success');
    }
    setSelectedIds(new Set());
    setBatchPending(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {['all', 'draft', 'sent', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filterLabels[s] ?? s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => requestBatchAction('approved')}>Aprovar ({selectedIds.size})</Button>
              <Button variant="destructive" size="sm" onClick={() => requestBatchAction('delete')}>Excluir ({selectedIds.size})</Button>
            </>
          )}
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Novo Orcamento
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted sticky top-0 z-10">
                  <th className="p-3 w-8"><input type="checkbox" onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(filtered.map(q => q.id)));
                    else setSelectedIds(new Set());
                  }} /></th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Cliente</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Descricao</th>
                  <th className="text-right p-3 text-xs font-semibold text-muted-foreground">Valor</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">Nenhum orcamento encontrado</td></tr>
                ) : filtered.map((quote) => {
                  return (
                    <tr key={quote.id} className="border-b border-border hover:bg-muted/50 transition-all duration-150">
                      <td className="p-3"><input type="checkbox" checked={selectedIds.has(quote.id)} onChange={() => toggleSelect(quote.id)} /></td>
                      <td className="p-3 font-semibold text-sm">{quote.clients?.name ?? 'Cliente'}</td>
                      <td className="p-3 text-sm text-muted-foreground hidden md:table-cell truncate max-w-[200px]">{quote.description}</td>
                      <td className="p-3 text-right font-bold text-sm text-green-700">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total_amount)}
                      </td>
                      <td className="p-3 text-center"><StatusBadge status={quote.status as Status} /></td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <button onClick={() => sendWhatsApp(quote)} className="p-1.5 hover:bg-muted rounded-lg" title="Enviar WhatsApp">
                            <Send className="h-4 w-4 text-green-600" />
                          </button>
                          <button onClick={() => duplicateQuote(quote)} className="p-1.5 hover:bg-muted rounded-lg" title="Duplicar">
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-border text-xs text-muted-foreground">
            Mostrando {filtered.length} de {totalCount} orcamentos
          </div>
        </CardContent>
      </Card>

      <QuoteFormDialog
        clients={clients}
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) router.refresh();
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={batchPending === 'delete' ? 'Excluir orcamentos' : 'Atualizar orcamentos'}
        description={`${batchPending === 'delete' ? 'Excluir' : 'Atualizar'} ${selectedIds.size} orcamento(s)?`}
        variant={batchPending === 'delete' ? 'destructive' : 'default'}
        onConfirm={executeBatchAction}
      />
    </>
  );
}
