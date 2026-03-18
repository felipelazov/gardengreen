import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';

import { PaymentModel } from '@/database/models/Payment';
import { generatePix } from '@/services/pixService';
import type { PixResponse } from '@/services/pixService';

// ---------------------------------------------------------------------------
// usePendingPayments — todos os pagamentos pendentes, mais antigos primeiro
// ---------------------------------------------------------------------------
export function usePendingPayments(userId: string) {
  const database = useDatabase();
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const collection = database.get<PaymentModel>('payments');
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('status', 'pending'),
          Q.sortBy('created_at', Q.asc),
        )
        .fetch();
      setPayments(results);
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

  return { payments, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// usePendingTotal — soma dos valores pendentes
// ---------------------------------------------------------------------------
export function usePendingTotal(userId: string) {
  const database = useDatabase();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const collection = database.get<PaymentModel>('payments');
      const results = await collection
        .query(Q.where('user_id', userId), Q.where('status', 'pending'))
        .fetch();

      const sum = results.reduce((acc, p) => acc + (p.amount ?? 0), 0);
      setTotal(sum);
    } catch (err) {
      console.error('usePendingTotal error:', err);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [database, userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { total, loading, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useCreatePixPayment — gera cobrança PIX e salva localmente
// ---------------------------------------------------------------------------
export function useCreatePixPayment() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPixPayment = useCallback(
    async (
      userId: string,
      serviceId: string,
      clientId: string,
      amount: number,
    ): Promise<{ localPayment: PaymentModel; pixData: PixResponse }> => {
      setLoading(true);
      setError(null);

      try {
        // Chamar Edge Function
        const pixData = await generatePix(serviceId, amount);

        // Salvar localmente
        let localPayment!: PaymentModel;
        await database.write(async () => {
          localPayment = await database.get<PaymentModel>('payments').create((p) => {
            p.serviceId = serviceId;
            p.userId = userId;
            p.clientId = clientId;
            p.amount = amount;
            p.method = 'pix';
            p.status = 'pending';
            p.pixTransactionId = pixData.payment_id;
            p.pixLink = pixData.link;
            p.paidAt = null;
          });
        });

        return { localPayment, pixData };
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

  return { createPixPayment, loading, error };
}

// ---------------------------------------------------------------------------
// useMarkPaid — marca pagamento como pago manualmente
// ---------------------------------------------------------------------------
export type ManualPaymentMethod = 'cash' | 'pix_direct' | 'transfer' | 'other';

export function useMarkPaid() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markPaid = useCallback(
    async (
      paymentId: string,
      method: ManualPaymentMethod,
      paidAt?: number,
    ): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const payment = await database.get<PaymentModel>('payments').find(paymentId);
        await database.write(async () => {
          await payment.update((p) => {
            p.status = 'paid';
            p.method = method;
            p.paidAt = paidAt ?? Date.now();
          });
        });
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

  return { markPaid, loading, error };
}

// ---------------------------------------------------------------------------
// usePaymentsByService — pagamentos de um servico especifico
// ---------------------------------------------------------------------------
export function usePaymentsByService(serviceId: string) {
  const database = useDatabase();
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!serviceId) return;
    try {
      setLoading(true);
      const collection = database.get<PaymentModel>('payments');
      const results = await collection
        .query(
          Q.where('service_id', serviceId),
          Q.sortBy('created_at', Q.desc),
        )
        .fetch();
      setPayments(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, serviceId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { payments, loading, error, refetch: fetch };
}
