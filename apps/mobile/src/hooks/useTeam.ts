import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { TeamModel } from '@/database/models/Team';
import { TeamMemberModel, type TeamMemberRole, type TeamMemberStatus } from '@/database/models/TeamMember';

// ---------------------------------------------------------------------------
// useTeam — dados da equipe pelo teamId
// ---------------------------------------------------------------------------
export function useTeam(teamId: string | null) {
  const database = useDatabase();
  const [team, setTeam] = useState<TeamModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await database.get<TeamModel>('teams').find(teamId);
      setTeam(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, [database, teamId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { team, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useTeamMembers — lista membros da equipe (exceto inactive por padrao)
// ---------------------------------------------------------------------------
export function useTeamMembers(teamId: string | null, includeInactive = false) {
  const database = useDatabase();
  const [members, setMembers] = useState<TeamMemberModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!teamId) {
      setMembers([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const collection = database.get<TeamMemberModel>('team_members');
      const queries = [Q.where('team_id', teamId)];
      if (!includeInactive) {
        queries.push(Q.where('status', Q.notEq('inactive')));
      }
      const results = await collection.query(...queries).fetch();
      setMembers(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [database, teamId, includeInactive]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { members, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// useInviteMember — cria convite de membro e abre SMS
// ---------------------------------------------------------------------------
export function useInviteMember() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const inviteMember = useCallback(
    async (teamId: string, name: string, phone: string): Promise<TeamMemberModel> => {
      setLoading(true);
      setError(null);
      try {
        let created!: TeamMemberModel;
        await database.write(async () => {
          created = await database.get<TeamMemberModel>('team_members').create((member) => {
            member.teamId = teamId;
            member.userId = null;
            member.name = name;
            member.phone = phone;
            member.role = 'member';
            member.status = 'invited';
            member.pushToken = null;
          });
        });

        // Abre SMS com link de convite
        const inviteLink = `https://gardengreen.app/convite/${created.id}`;
        const message = `Ola ${name}! Voce foi convidado para usar o GardenGreen. Acesse: ${inviteLink}`;
        const smsUrl = `sms:${phone.replace(/\D/g, '')}?body=${encodeURIComponent(message)}`;
        await Linking.openURL(smsUrl);

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

  return { inviteMember, loading, error };
}

// ---------------------------------------------------------------------------
// useRemoveMember — define membro como inactive e desatribui servicos futuros
// ---------------------------------------------------------------------------
export function useRemoveMember() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const removeMember = useCallback(
    async (memberId: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await database.write(async () => {
          const member = await database.get<TeamMemberModel>('team_members').find(memberId);

          // Desatribuir servicos futuros deste membro
          if (member.userId) {
            const today = new Date().toISOString().split('T')[0]!;
            const futureServices = await database
              .get<any>('services')
              .query(
                Q.where('assigned_to', member.userId),
                Q.where('date', Q.gte(today)),
                Q.where('status', Q.notEq('cancelled')),
              )
              .fetch();

            for (const service of futureServices) {
              await service.update((s: any) => {
                s.assignedTo = null;
              });
            }
          }

          // Marca membro como inativo
          await member.update((m) => {
            m.status = 'inactive';
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

  return { removeMember, loading, error };
}

// ---------------------------------------------------------------------------
// useCreateTeam — cria equipe e define o usuario como admin
// ---------------------------------------------------------------------------
export function useCreateTeam() {
  const database = useDatabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTeam = useCallback(
    async (userId: string, userName: string, userPhone: string): Promise<TeamModel> => {
      setLoading(true);
      setError(null);
      try {
        let team!: TeamModel;
        await database.write(async () => {
          team = await database.get<TeamModel>('teams').create((t) => {
            t.name = `Equipe de ${userName}`;
            t.ownerId = userId;
            t.plan = 'team';
          });

          // Cria o admin como membro da equipe
          await database.get<TeamMemberModel>('team_members').create((m) => {
            m.teamId = team.id;
            m.userId = userId;
            m.name = userName;
            m.phone = userPhone;
            m.role = 'admin';
            m.status = 'active';
            m.pushToken = null;
          });
        });

        return team;
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

  return { createTeam, loading, error };
}

// ---------------------------------------------------------------------------
// useIsAdmin — verifica se um userId e admin da equipe
// ---------------------------------------------------------------------------
export function useIsAdmin(teamId: string | null, userId: string | null) {
  const database = useDatabase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    if (!teamId || !userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    try {
      const results = await database
        .get<TeamMemberModel>('team_members')
        .query(
          Q.where('team_id', teamId),
          Q.where('user_id', userId),
          Q.where('role', 'admin'),
          Q.where('status', 'active'),
        )
        .fetch();
      setIsAdmin(results.length > 0);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [database, teamId, userId]);

  useEffect(() => {
    check();
  }, [check]);

  return { isAdmin, loading };
}
