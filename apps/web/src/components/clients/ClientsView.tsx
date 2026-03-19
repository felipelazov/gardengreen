'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Phone, MapPin } from 'lucide-react';
import { ClientFormDialog } from './ClientFormDialog';

interface ClientRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  status: string;
  services_count: number;
  created_at: string;
}

export function ClientsView({ initialClients, totalCount }: { initialClients: ClientRow[]; totalCount: number }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);

  const filtered = useMemo(() => {
    return initialClients.filter((c) => {
      const matchesSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.neighborhood ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialClients, search, statusFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, telefone ou bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <Button onClick={() => { setEditingClient(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Nome</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Telefone</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Bairro</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Servicos</th>
                  <th className="text-center p-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => { setEditingClient(client); setShowForm(true); }}
                    >
                      <td className="p-3">
                        <p className="font-semibold text-sm">{client.name}</p>
                        {client.city && <p className="text-xs text-muted-foreground">{client.city}</p>}
                      </td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {client.phone}
                        </span>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {client.neighborhood && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {client.neighborhood}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center hidden lg:table-cell">
                        <span className="text-sm font-medium">{client.services_count}</span>
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                          {client.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-border text-xs text-muted-foreground">
            Mostrando {filtered.length} de {totalCount} clientes
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ClientFormDialog
          client={editingClient}
          onClose={() => { setShowForm(false); setEditingClient(null); }}
        />
      )}
    </>
  );
}
