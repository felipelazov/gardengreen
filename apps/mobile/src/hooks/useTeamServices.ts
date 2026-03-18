import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';

import { ServiceModel } from '@/database/models/Service';
import { supabase } from '@shared/lib/supabase';

// ---------------------------------------------------------------------------
// useTeamTodayServices — todos os servicos do dia para a visao admin de equipe
// ---------------------------------------------------------------------------
export function useTeamTodayServices(teamId: string | null) {
  const database = useDatabase();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split('T')[0]!;

  const fetch = useCallback(async () => {
    if (!teamId) {
      setServices([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const results = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('team_id', teamId),
          Q.where('date', today),
          Q.where('status', Q.notEq('cancelled')),
          Q.sortBy('time', Q.asc),
        )
        .fetch();
      // Servicos sem atribuicao primeiro, depois por horario
      const unassigned = results.filter((s) => !s.assignedTo);
      const assigned = results.filter((s) => !!s.assignedTo);
      setServices([...unassigned, ...assigned]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, teamId, today]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { services, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useAssignedServices — servicos atribuidos a um membro especifico
// ---------------------------------------------------------------------------
export function useAssignedServices(userId: string | null) {
  const database = useDatabase();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split('T')[0]!;

  const fetch = useCallback(async () => {
    if (!userId) {
      setServices([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const results = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('assigned_to', userId),
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
// useUnassignedServices — servicos sem atribuicao da equipe
// ---------------------------------------------------------------------------
export function useUnassignedServices(teamId: string | null) {
  const database = useDatabase();
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split('T')[0]!;

  const fetch = useCallback(async () => {
    if (!teamId) {
      setServices([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const results = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('team_id', teamId),
          Q.where('assigned_to', null),
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
  }, [database, teamId, today]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { services, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useTeamServiceStats — contagens para a barra de resumo
// ---------------------------------------------------------------------------
export function useTeamServiceStats(teamId: string | null) {
  const database = useDatabase();
  const [stats, setStats] = useState({ total: 0, assigned: 0, unassigned: 0 });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0]!;

  const fetch = useCallback(async () => {
    if (!teamId) {
      setStats({ total: 0, assigned: 0, unassigned: 0 });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const all = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('team_id', teamId),
          Q.where('date', today),
          Q.where('status', Q.notEq('cancelled')),
        )
        .fetchCount();

      const assigned = await database
        .get<ServiceModel>('services')
        .query(
          Q.where('team_id', teamId),
          Q.where('date', today),
          Q.where('status', Q.notEq('cancelled')),
          Q.where('assigned_to', Q.notEq(null)),
        )
        .fetchCount();

      setStats({ total: all, assigned, unassigned: all - assigned });
    } catch {
      setStats({ total: 0, assigned: 0, unassigned: 0 });
    } finally {
      setLoading(false);
    }
  }, [database, teamId, today]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useAssignService — atribui servico a um membro e notifica via Edge Function
// ---------------------------------------------------------------------------
export function useAssignService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const assignService = useCallback(
    async (params: {
      serviceId: string;
      memberId: string;
      memberUserId: string;
      clientName: string;
      serviceDate: string;
    }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const service = await database.get<ServiceModel>('services').find(params.serviceId);
        await database.write(async () => {
          await service.update((s) => {
            s.assignedTo = params.memberUserId;
          });
        });

        // Notifica o membro via Edge Function (falha silenciosa)
        supabase.functions
          .invoke('send-team-notification', {
            body: {
              service_id: params.serviceId,
              member_id: params.memberId,
              type: 'assigned',
              client_name: params.clientName,
              service_date: params.serviceDate,
            },
          })
          .catch((e) => console.warn('send-team-notification falhou:', e));
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

  return { assignService, loading, error };
}

// ---------------------------------------------------------------------------
// useReassignService — reatribui servico notificando ambos os membros
// ---------------------------------------------------------------------------
export function useReassignService() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reassignService = useCallback(
    async (params: {
      serviceId: string;
      oldMemberId: string;
      newMemberId: string;
      newMemberUserId: string;
      clientName: string;
      serviceDate: string;
    }): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const service = await database.get<ServiceModel>('services').find(params.serviceId);
        await database.write(async () => {
          await service.update((s) => {
            s.assignedTo = params.newMemberUserId;
          });
        });

        // Notifica ambos via Edge Function (falha silenciosa)
        supabase.functions
          .invoke('send-team-notification', {
            body: {
              service_id: params.serviceId,
              member_id: params.newMemberId,
              old_member_id: params.oldMemberId,
              type: 'reassigned',
              client_name: params.clientName,
              service_date: params.serviceDate,
            },
          })
          .catch((e) => console.warn('send-team-notification falhou:', e));
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

  return { reassignService, loading, error };
}
