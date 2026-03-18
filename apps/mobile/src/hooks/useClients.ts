import { Q } from '@nozbe/watermelondb';
import { useEffect, useMemo, useState } from 'react';

import { database } from '@/database';
import { ClientModel } from '@/database/models/Client';
import { NoteModel } from '@/database/models/Note';

// ─── useClients ────────────────────────────────────────────────────────────────

export function useClients(userId: string) {
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setClients([]);
      setLoading(false);
      return;
    }

    const collection = database.get<ClientModel>('clients');
    const query = collection.query(
      Q.where('user_id', userId),
      Q.sortBy('name', Q.asc),
    );

    const subscription = query.observe().subscribe({
      next: (results) => {
        setClients(results);
        setLoading(false);
      },
      error: (err) => {
        console.error('[useClients] observe error:', err);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  return { clients, loading };
}

// ─── useClient ─────────────────────────────────────────────────────────────────

export function useClient(clientId: string) {
  const [client, setClient] = useState<ClientModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setClient(null);
      setLoading(false);
      return;
    }

    const collection = database.get<ClientModel>('clients');

    const subscription = collection.findAndObserve(clientId).subscribe({
      next: (result) => {
        setClient(result);
        setLoading(false);
      },
      error: (err) => {
        console.error('[useClient] observe error:', err);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [clientId]);

  return { client, loading };
}

// ─── useCreateClient ───────────────────────────────────────────────────────────

export interface CreateClientParams {
  userId: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  notes?: string | null;
}

export function useCreateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function createClient(params: CreateClientParams): Promise<ClientModel | null> {
    setLoading(true);
    setError(null);

    try {
      const collection = database.get<ClientModel>('clients');

      // Duplicate phone check
      const existing = await collection
        .query(
          Q.where('phone', params.phone),
          Q.where('user_id', params.userId),
        )
        .fetch();

      if (existing.length > 0) {
        throw new Error('Ja existe um cliente com este telefone.');
      }

      let created: ClientModel | null = null;

      await database.write(async () => {
        created = await collection.create((record) => {
          record.name = params.name;
          record.phone = params.phone;
          record.email = params.email ?? null;
          record.address = params.address ?? null;
          record.neighborhood = params.neighborhood ?? null;
          record.city = params.city ?? null;
          record.notes = params.notes ?? null;
          record.status = 'active';
          record.userId = params.userId;
        });
      });

      return created;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { createClient, loading, error };
}

// ─── useUpdateClient ───────────────────────────────────────────────────────────

export interface UpdateClientParams {
  name?: string;
  phone?: string;
  email?: string | null;
  address?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  notes?: string | null;
  status?: string;
}

export function useUpdateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function updateClient(client: ClientModel, params: UpdateClientParams): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      await database.write(async () => {
        await client.update((record) => {
          if (params.name !== undefined) record.name = params.name!;
          if (params.phone !== undefined) record.phone = params.phone!;
          if (params.email !== undefined) record.email = params.email ?? null;
          if (params.address !== undefined) record.address = params.address ?? null;
          if (params.neighborhood !== undefined) record.neighborhood = params.neighborhood ?? null;
          if (params.city !== undefined) record.city = params.city ?? null;
          if (params.notes !== undefined) record.notes = params.notes ?? null;
          if (params.status !== undefined) record.status = params.status!;
        });
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { updateClient, loading, error };
}

// ─── useClientSearch ───────────────────────────────────────────────────────────

export type ClientFilter = 'all' | 'active' | 'pending_payment';

export function useClientSearch(
  userId: string,
  query: string,
  filter: ClientFilter = 'all',
) {
  const [clients, setClients] = useState<ClientModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!userId) {
      setClients([]);
      setLoading(false);
      return;
    }

    const collection = database.get<ClientModel>('clients');
    const conditions: Q.Clause[] = [Q.where('user_id', userId)];

    if (filter === 'active') {
      conditions.push(Q.where('status', 'active'));
    } else if (filter === 'pending_payment') {
      conditions.push(Q.where('status', 'pending_payment'));
    }

    const queryObj = collection.query(...conditions, Q.sortBy('name', Q.asc));

    const subscription = queryObj.observe().subscribe({
      next: (results) => {
        const term = debouncedQuery.toLowerCase().trim();
        if (!term) {
          setClients(results);
        } else {
          setClients(
            results.filter((c) => {
              return (
                c.name.toLowerCase().includes(term) ||
                (c.phone && c.phone.includes(term)) ||
                (c.address && c.address.toLowerCase().includes(term)) ||
                (c.neighborhood && c.neighborhood.toLowerCase().includes(term)) ||
                (c.city && c.city.toLowerCase().includes(term))
              );
            }),
          );
        }
        setLoading(false);
      },
      error: (err) => {
        console.error('[useClientSearch] observe error:', err);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [userId, debouncedQuery, filter]);

  return { clients, loading };
}

// ─── useCreateNote ─────────────────────────────────────────────────────────────

export function useCreateNote() {
  const [loading, setLoading] = useState(false);

  async function createNote(params: {
    clientId: string;
    userId: string;
    content: string;
  }): Promise<NoteModel | null> {
    setLoading(true);
    try {
      const collection = database.get<NoteModel>('notes');
      let created: NoteModel | null = null;

      await database.write(async () => {
        created = await collection.create((record) => {
          record.clientId = params.clientId;
          record.userId = params.userId;
          record.content = params.content;
        });
      });

      return created;
    } catch (err) {
      console.error('[useCreateNote] error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createNote, loading };
}

// ─── useClientNotes ────────────────────────────────────────────────────────────

export function useClientNotes(clientId: string) {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const collection = database.get<NoteModel>('notes');
    const queryObj = collection.query(
      Q.where('client_id', clientId),
      Q.sortBy('created_at', Q.desc),
    );

    const subscription = queryObj.observe().subscribe({
      next: (results) => {
        setNotes(results);
        setLoading(false);
      },
      error: (err) => {
        console.error('[useClientNotes] observe error:', err);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [clientId]);

  return { notes, loading };
}
