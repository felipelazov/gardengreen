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

interface RecordRow {
  id: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface TableChanges {
  created: RecordRow[];
  updated: RecordRow[];
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
    const { changes } = body as { changes: Record<string, TableChanges> };

    const errors: string[] = [];

    for (const [table, tableChanges] of Object.entries(changes)) {
      // Guard against tables not in the allowlist
      if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
        errors.push(`Table '${table}' is not allowed`);
        continue;
      }

      const allowedTable = table as AllowedTable;
      const { created, updated, deleted } = tableChanges;

      // --- Handle created records ---
      if (created.length > 0) {
        const rows = created.map((r) => ({ ...r, user_id: user.id }));
        const { error } = await supabase
          .from(allowedTable)
          .upsert(rows, { onConflict: 'id' });

        if (error) {
          errors.push(`Insert into ${allowedTable}: ${error.message}`);
        }
      }

      // --- Handle updated records (Last Write Wins) ---
      if (updated.length > 0) {
        for (const incoming of updated) {
          // Fetch existing record to compare updated_at timestamps
          const { data: existing } = await supabase
            .from(allowedTable)
            .select('updated_at')
            .eq('id', incoming.id)
            .eq('user_id', user.id)
            .maybeSingle();

          // Only apply if incoming is newer than what is stored
          const existingUpdatedAt = existing?.updated_at
            ? new Date(existing.updated_at as string).getTime()
            : 0;
          const incomingUpdatedAt = incoming.updated_at
            ? new Date(incoming.updated_at).getTime()
            : 0;

          if (incomingUpdatedAt >= existingUpdatedAt) {
            const { error } = await supabase
              .from(allowedTable)
              .upsert({ ...incoming, user_id: user.id }, { onConflict: 'id' });

            if (error) {
              errors.push(`Update ${allowedTable}/${incoming.id}: ${error.message}`);
            }
          }
        }
      }

      // --- Handle deleted records (soft-delete via deleted_at, fallback to hard-delete) ---
      if (deleted.length > 0) {
        // Attempt soft-delete first (requires deleted_at column on the table)
        const { error: softDeleteError } = await supabase
          .from(allowedTable)
          .update({ deleted_at: new Date().toISOString() })
          .in('id', deleted)
          .eq('user_id', user.id);

        if (softDeleteError) {
          // If soft-delete fails (column doesn't exist), fall back to hard-delete
          const { error: hardDeleteError } = await supabase
            .from(allowedTable)
            .delete()
            .in('id', deleted)
            .eq('user_id', user.id);

          if (hardDeleteError) {
            errors.push(`Delete from ${allowedTable}: ${hardDeleteError.message}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ ok: false, errors }),
        {
          status: 207,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
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
