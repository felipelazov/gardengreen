// apps/mobile/src/hooks/useNotificationPreferences.ts
// Hook para carregar e atualizar preferencias de notificacao do usuario
// [Source: PRD EPIC-07, Story 7.3]

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@shared/lib/supabase';
import type { NotificationPreference } from '@shared/types/database';

interface UseNotificationPreferencesResult {
  preferences: NotificationPreference | null;
  loading: boolean;
  error: string | null;
}

interface UseUpdatePreferencesResult {
  updatePreferences: (updates: Partial<NotificationPreference>) => Promise<void>;
  saving: boolean;
  saveError: string | null;
}

/**
 * Carrega as preferencias de notificacao do usuario a partir do Supabase.
 */
export function useNotificationPreferences(
  userId: string | undefined,
): UseNotificationPreferencesResult {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPreferences() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (cancelled) return;

        if (fetchError) {
          console.error('useNotificationPreferences: erro ao carregar:', fetchError);
          setError('Nao foi possivel carregar as configuracoes');
          return;
        }

        setPreferences(data as NotificationPreference);
      } catch (err) {
        if (!cancelled) {
          console.error('useNotificationPreferences: erro inesperado:', err);
          setError('Erro ao carregar configuracoes');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPreferences();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { preferences, loading, error };
}

/**
 * Retorna uma funcao para atualizar preferencias de notificacao no Supabase.
 */
export function useUpdatePreferences(
  userId: string | undefined,
  onSuccess?: (updated: Partial<NotificationPreference>) => void,
): UseUpdatePreferencesResult {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreference>) => {
      if (!userId) return;

      setSaving(true);
      setSaveError(null);

      try {
        const { error: updateError } = await supabase
          .from('notification_preferences')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('user_id', userId);

        if (updateError) {
          console.error('useUpdatePreferences: erro ao salvar:', updateError);
          setSaveError('Nao foi possivel salvar as configuracoes');
          return;
        }

        onSuccess?.(updates);
      } catch (err) {
        console.error('useUpdatePreferences: erro inesperado:', err);
        setSaveError('Erro ao salvar configuracoes');
      } finally {
        setSaving(false);
      }
    },
    [userId, onSuccess],
  );

  return { updatePreferences, saving, saveError };
}
