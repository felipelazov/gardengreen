import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';

import { ServiceModel } from '@/database/models/Service';
import type { CreateServiceInput } from '@shared/schemas/serviceSchema';

// ---------------------------------------------------------------------------
// useTodayServices — servicos do dia ordenados por horario
// ---------------------------------------------------------------------------
export function useTodayServices(userId: string) {
  const database = useDatabase();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const collection = database.get<ServiceModel>('services');
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('date', today),
          Q.where('status', Q.notEq('cancelled')),
          Q.sortBy('time', Q.asc),
        )
        .fetch();
      setServices(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, userId, today]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { services, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useWeekServices — servicos de uma semana
// ---------------------------------------------------------------------------
export function useWeekServices(userId: string, weekDates: string[]) {
  const database = useDatabase();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const weekStart = weekDates[0] ?? '';
  const weekEnd = weekDates[6] ?? '';

  const fetch = useCallback(async () => {
    if (!weekStart || !weekEnd) return;
    try {
      setLoading(true);
      const collection = database.get<ServiceModel>('services');
      const results = await collection
        .query(
          Q.where('user_id', userId),
          Q.where('date', Q.gte(weekStart)),
          Q.where('date', Q.lte(weekEnd)),
          Q.sortBy('date', Q.asc),
          Q.sortBy('time', Q.asc),
        )
        .fetch();
      setServices(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, userId, weekStart, weekEnd]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { services, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useCreateService — cria servico no WatermelonDB
// ---------------------------------------------------------------------------
export function useCreateService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createService = useCallback(
    async (userId: string, input: CreateServiceInput): Promise<ServiceModel> => {
      setLoading(true);
      setError(null);
      try {
        let created!: ServiceModel;
        await database.write(async () => {
          created = await database.get<ServiceModel>('services').create((service) => {
            service.userId = userId;
            service.clientId = input.client_id;
            service.date = input.date;
            service.time = input.time ?? null;
            service.type = input.type;
            service.description = input.description ?? null;
            service.value = input.value;
            service.status = 'scheduled';
            service.notes = input.notes ?? null;
            service.recurrenceId = input.recurrence_id ?? null;
            service.completedAt = null;
            service.cancelledAt = null;
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

  return { createService, loading, error };
}

// ---------------------------------------------------------------------------
// useCompleteService — marca servico como concluido
// ---------------------------------------------------------------------------
export function useCompleteService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const completeService = useCallback(
    async (serviceId: string) => {
      setLoading(true);
      try {
        const service = await database.get<ServiceModel>('services').find(serviceId);
        await database.write(async () => {
          await service.update((s) => {
            s.status = 'completed';
            s.completedAt = Date.now();
          });
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { completeService, loading };
}

// ---------------------------------------------------------------------------
// useCancelService — cancela servico (soft-delete)
// ---------------------------------------------------------------------------
export function useCancelService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const cancelService = useCallback(
    async (serviceId: string) => {
      setLoading(true);
      try {
        const service = await database.get<ServiceModel>('services').find(serviceId);
        await database.write(async () => {
          await service.update((s) => {
            s.status = 'cancelled';
            s.cancelledAt = Date.now();
          });
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { cancelService, loading };
}

// ---------------------------------------------------------------------------
// useRescheduleService — reagenda servico, salva data original nas notas
// ---------------------------------------------------------------------------
export function useRescheduleService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const rescheduleService = useCallback(
    async (serviceId: string, newDate: string, newTime?: string | null) => {
      setLoading(true);
      try {
        const service = await database.get<ServiceModel>('services').find(serviceId);
        const originalDate = service.date;
        const originalTime = service.time;
        await database.write(async () => {
          await service.update((s) => {
            s.date = newDate;
            s.time = newTime ?? null;
            s.status = 'scheduled';
            const reagendadoNote = `Reagendado de ${originalDate}${originalTime ? ' ' + originalTime : ''}`;
            s.notes = s.notes ? `${s.notes}\n${reagendadoNote}` : reagendadoNote;
          });
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { rescheduleService, loading };
}
