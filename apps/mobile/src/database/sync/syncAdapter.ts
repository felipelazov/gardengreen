import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../index';
import { supabase } from '@shared/lib/supabase';

const SYNC_TABLES = [
  'clients',
  'services',
  'payments',
  'quotes',
  'expenses',
  'photos',
  'notes',
  'recurrences',
] as const;

export async function syncDatabase(): Promise<void> {
  await synchronize({
    database,

    pullChanges: async ({ lastPulledAt }) => {
      const { data, error } = await supabase.functions.invoke('sync-pull', {
        body: {
          last_pulled_at: lastPulledAt,
          tables: SYNC_TABLES,
        },
      });

      if (error) throw new Error(`Pull failed: ${error.message}`);

      return {
        changes: data.changes,
        timestamp: data.timestamp,
      };
    },

    pushChanges: async ({ changes, lastPulledAt }) => {
      const { error } = await supabase.functions.invoke('sync-push', {
        body: {
          changes,
          last_pulled_at: lastPulledAt,
        },
      });

      if (error) throw new Error(`Push failed: ${error.message}`);
    },

    migrationsEnabledAtVersion: 1,
  });
}
