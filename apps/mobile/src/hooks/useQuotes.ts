import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';

import { ServiceModel } from '@/database/models/Service';
import { QuoteModel } from '@/database/models/Quote';
import type { CreateQuoteInput, QuoteItem } from '@shared/schemas/quoteSchema';

// ---------------------------------------------------------------------------
// useQuotes — todos os orcamentos do usuario, mais recentes primeiro
// ---------------------------------------------------------------------------
export function useQuotes(userId: string) {
  const database = useDatabase();
  const [quotes, setQuotes] = useState<QuoteModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const collection = database.get<QuoteModel>('quotes');
      const results = await collection
        .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
        .fetch();

      // Verificar expiracao local: sent + valid_until < hoje → expired
      const today = new Date().toISOString().split('T')[0];
      const toExpire = results.filter(
        (q) => q.status === 'sent' && q.validUntil < today,
      );
      if (toExpire.length > 0) {
        await database.write(async () => {
          for (const q of toExpire) {
            await q.update((quote) => {
              quote.status = 'expired';
            });
          }
        });
        // Re-fetch apos atualizar
        const updated = await collection
          .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
          .fetch();
        setQuotes(updated);
      } else {
        setQuotes(results);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { quotes, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useQuotesByStatus — orcamentos filtrados por status
// ---------------------------------------------------------------------------
export function useQuotesByStatus(userId: string, status: string | null) {
  const database = useDatabase();
  const [quotes, setQuotes] = useState<QuoteModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const collection = database.get<QuoteModel>('quotes');
      const conditions = [Q.where('user_id', userId)];
      if (status) {
        conditions.push(Q.where('status', status));
      }
      const results = await collection
        .query(...conditions, Q.sortBy('created_at', Q.desc))
        .fetch();
      setQuotes(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, userId, status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { quotes, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useCreateQuote — cria orcamento com numero sequencial ORC-XXX
// ---------------------------------------------------------------------------
export function useCreateQuote() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuote = useCallback(
    async (userId: string, input: CreateQuoteInput): Promise<QuoteModel> => {
      setLoading(true);
      setError(null);
      try {
        // Calcular proximo numero sequencial
        const collection = database.get<QuoteModel>('quotes');
        const existing = await collection
          .query(Q.where('user_id', userId), Q.sortBy('created_at', Q.desc))
          .fetch();

        let nextNumber = 1;
        if (existing.length > 0) {
          // Extrair numeros dos orcamentos existentes e pegar o maior
          const nums = existing
            .map((q) => {
              const match = q.number.match(/ORC-(\d+)/);
              return match ? parseInt(match[1], 10) : 0;
            })
            .filter((n) => !isNaN(n));
          if (nums.length > 0) {
            nextNumber = Math.max(...nums) + 1;
          }
        }
        const quoteNumber = `ORC-${String(nextNumber).padStart(3, '0')}`;

        // Calcular total
        const total = input.items.reduce(
          (sum, item) => sum + item.value * item.quantity,
          0,
        );

        let created!: QuoteModel;
        await database.write(async () => {
          created = await collection.create((quote) => {
            quote.userId = userId;
            quote.clientId = input.client_id;
            quote.number = quoteNumber;
            quote.items = JSON.stringify(input.items);
            quote.total = total;
            quote.status = 'draft';
            quote.validUntil = input.valid_until;
            quote.sentAt = null;
            quote.approvedAt = null;
            quote.notes = input.notes ?? null;
          });
        });
        return created;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { createQuote, loading, error };
}

// ---------------------------------------------------------------------------
// useUpdateQuoteStatus — atualiza status do orcamento
// ---------------------------------------------------------------------------
export function useUpdateQuoteStatus() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const updateStatus = useCallback(
    async (quoteId: string, status: string) => {
      setLoading(true);
      try {
        const quote = await database.get<QuoteModel>('quotes').find(quoteId);
        await database.write(async () => {
          await quote.update((q) => {
            q.status = status;
            if (status === 'sent') {
              q.sentAt = Date.now();
            }
            if (status === 'approved') {
              q.approvedAt = Date.now();
            }
          });
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { updateStatus, loading };
}

// ---------------------------------------------------------------------------
// useConvertToService — converte orcamento aprovado em servico
// ---------------------------------------------------------------------------
export function useConvertToService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const convertToService = useCallback(
    async (userId: string, quoteId: string): Promise<ServiceModel> => {
      setLoading(true);
      setError(null);
      try {
        const quote = await database.get<QuoteModel>('quotes').find(quoteId);
        const items: QuoteItem[] = JSON.parse(quote.items);
        const today = new Date().toISOString().split('T')[0];

        let createdService!: ServiceModel;
        await database.write(async () => {
          // Criar servico com dados do orcamento
          createdService = await database.get<ServiceModel>('services').create((service) => {
            service.userId = userId;
            service.clientId = quote.clientId;
            service.date = today;
            service.time = null;
            service.type = 'servico';
            service.description = items.map((i) => i.description).join(', ');
            service.value = quote.total;
            service.status = 'scheduled';
            service.notes = `Originado do orcamento ${quote.number}`;
            service.recurrenceId = null;
            service.completedAt = null;
            service.cancelledAt = null;
          });
        });

        return createdService;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { convertToService, loading, error };
}
