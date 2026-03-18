import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';

const ALLOWED_TABLES = [
  'clients',
  'services',
  'payments',
  'quotes',
  'expenses',
  'photos',
  'notes',
  'recurrences',
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

interface TableChanges {
  created: Record<string, unknown>[];
  updated: Record<string, unknown>[];
  deleted: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) throw new Error('Unauthorized');

    const body = await req.json();
    const { last_pulled_at, tables } = body as {
      last_pulled_at: number | null;
      tables: string[];
    };

    // Validate requested tables against allowlist
    const requestedTables = (tables as string[]).filter((t): t is AllowedTable =>
      (ALLOWED_TABLES as readonly string[]).includes(t),
    );

    const since =
      last_pulled_at != null
        ? new Date(last_pulled_at).toISOString()
        : new Date(0).toISOString();

    const changes: Record<string, TableChanges> = {};

    for (const table of requestedTables) {
      const { data: records, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('user_id', user.id)
        .gte('updated_at', since);

      if (fetchError) {
        console.error(`Error fetching ${table}:`, fetchError.message);
        changes[table] = { created: [], updated: [], deleted: [] };
        continue;
      }

      const created: Record<string, unknown>[] = [];
      const updated: Record<string, unknown>[] = [];

      for (const record of records ?? []) {
        const createdAt = record.created_at as string | null;
        if (createdAt != null && new Date(createdAt) >= new Date(since)) {
          created.push(record as Record<string, unknown>);
        } else {
          updated.push(record as Record<string, unknown>);
        }
      }

      changes[table] = { created, updated, deleted: [] };
    }

    return new Response(
      JSON.stringify({
        changes,
        timestamp: Date.now(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
