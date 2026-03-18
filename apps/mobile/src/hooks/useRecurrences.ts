import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useState } from 'react';

import { RecurrenceModel } from '@/database/models/Recurrence';
import { ServiceModel } from '@/database/models/Service';

export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface CreateRecurrenceInput {
  userId: string;
  clientId: string;
  serviceType: string;
  value: number;
  frequency: RecurrenceFrequency;
  dayOfWeek: number;
  time?: string | null;
  startDate: string;
  description?: string | null;
  notes?: string | null;
}

// ---------------------------------------------------------------------------
// generateRecurrenceInstances — gera datas concretas de servicos (8 semanas)
// ---------------------------------------------------------------------------
export function generateRecurrenceInstances(
  startDate: string,
  frequency: RecurrenceFrequency,
  weeks: number = 8,
): string[] {
  const dates: string[] = [];
  const start = new Date(startDate + 'T12:00:00');

  for (let i = 0; i < weeks; i++) {
    const d = new Date(start);

    if (frequency === 'weekly') {
      d.setDate(start.getDate() + i * 7);
    } else if (frequency === 'biweekly') {
      d.setDate(start.getDate() + i * 14);
      // biweekly: apenas metade das iteracoes sao usadas
      if (i % 2 !== 0) continue;
    } else if (frequency === 'monthly') {
      d.setMonth(start.getMonth() + i);
      if (i >= Math.ceil(weeks / 4)) break;
    }

    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}

function getInstanceDates(
  startDate: string,
  frequency: RecurrenceFrequency,
  weeks: number = 8,
): string[] {
  const dates: string[] = [];
  const start = new Date(startDate + 'T12:00:00');

  if (frequency === 'weekly') {
    for (let i = 0; i < weeks; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i * 7);
      dates.push(d.toISOString().split('T')[0]);
    }
  } else if (frequency === 'biweekly') {
    for (let i = 0; i < weeks; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i * 14);
      dates.push(d.toISOString().split('T')[0]);
    }
  } else if (frequency === 'monthly') {
    const monthsToGen = Math.ceil(weeks / 4);
    for (let i = 0; i < monthsToGen; i++) {
      const d = new Date(start);
      d.setMonth(start.getMonth() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  return dates;
}

// ---------------------------------------------------------------------------
// useCreateRecurrence — cria recorrencia + 8 semanas de instancias
// ---------------------------------------------------------------------------
export function useCreateRecurrence() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRecurrence = useCallback(
    async (input: CreateRecurrenceInput): Promise<RecurrenceModel> => {
      setLoading(true);
      setError(null);
      try {
        let createdRecurrence!: RecurrenceModel;
        const instanceDates = getInstanceDates(input.startDate, input.frequency, 8);

        // Calcula next_generation_date (ultima data gerada + 1 ciclo)
        const lastDate = instanceDates[instanceDates.length - 1] ?? input.startDate;
        const nextGenDate = new Date(lastDate + 'T12:00:00');
        if (input.frequency === 'weekly') nextGenDate.setDate(nextGenDate.getDate() + 7);
        else if (input.frequency === 'biweekly') nextGenDate.setDate(nextGenDate.getDate() + 14);
        else nextGenDate.setMonth(nextGenDate.getMonth() + 1);

        await database.write(async () => {
          // Cria a recorrencia
          createdRecurrence = await database
            .get<RecurrenceModel>('recurrences')
            .create((r) => {
              r.userId = input.userId;
              r.clientId = input.clientId;
              r.serviceType = input.serviceType;
              r.value = input.value;
              r.frequency = input.frequency;
              r.dayOfWeek = input.dayOfWeek;
              r.time = input.time ?? null;
              r.active = true;
              r.nextGenerationDate = nextGenDate.toISOString().split('T')[0];
            });

          // Gera instancias de servicos
          for (const date of instanceDates) {
            await database.get<ServiceModel>('services').create((s) => {
              s.userId = input.userId;
              s.clientId = input.clientId;
              s.date = date;
              s.time = input.time ?? null;
              s.type = input.serviceType;
              s.value = input.value;
              s.status = 'scheduled';
              s.recurrenceId = createdRecurrence.id;
              s.description = input.description ?? null;
              s.notes = input.notes ?? null;
              s.completedAt = null;
              s.cancelledAt = null;
            });
          }
        });

        return createdRecurrence;
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

  return { createRecurrence, loading, error };
}

// ---------------------------------------------------------------------------
// useUpdateRecurrence — "apenas este" vs "todos os futuros"
// ---------------------------------------------------------------------------
export function useUpdateRecurrence() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);

  const updateThisOnly = useCallback(
    async (
      serviceId: string,
      changes: Partial<{
        date: string;
        time: string | null;
        value: number;
        type: string;
        notes: string | null;
      }>,
    ) => {
      setLoading(true);
      try {
        const service = await database.get<ServiceModel>('services').find(serviceId);
        await database.write(async () => {
          await service.update((s) => {
            // Desvincula da recorrencia para ser tratado como servico avulso
            s.recurrenceId = null;
            if (changes.date !== undefined) s.date = changes.date;
            if (changes.time !== undefined) s.time = changes.time;
            if (changes.value !== undefined) s.value = changes.value;
            if (changes.type !== undefined) s.type = changes.type;
            if (changes.notes !== undefined) s.notes = changes.notes;
          });
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  const updateAllFuture = useCallback(
    async (
      recurrenceId: string,
      fromDate: string,
      changes: Partial<{
        time: string | null;
        value: number;
        type: string;
      }>,
    ) => {
      setLoading(true);
      try {
        const { Q } = await import('@nozbe/watermelondb');
        const futureServices = await database
          .get<ServiceModel>('services')
          .query(
            Q.where('recurrence_id', recurrenceId),
            Q.where('date', Q.gte(fromDate)),
            Q.where('status', 'scheduled'),
          )
          .fetch();

        await database.write(async () => {
          // Atualiza recorrencia base
          const recurrence = await database
            .get<RecurrenceModel>('recurrences')
            .find(recurrenceId);
          await recurrence.update((r) => {
            if (changes.time !== undefined) r.time = changes.time;
            if (changes.value !== undefined) r.value = changes.value;
            if (changes.type !== undefined) r.serviceType = changes.type;
          });

          // Atualiza servicos futuros
          for (const s of futureServices) {
            await s.update((service) => {
              if (changes.time !== undefined) service.time = changes.time;
              if (changes.value !== undefined) service.value = changes.value;
              if (changes.type !== undefined) service.type = changes.type;
            });
          }
        });
      } finally {
        setLoading(false);
      }
    },
    [database],
  );

  return { updateThisOnly, updateAllFuture, loading };
}
