// apps/mobile/src/hooks/usePushNotifications.ts
// Hook para registrar o Expo Push Token do dispositivo no Supabase
// [Source: PRD EPIC-07, Story 7.1 — AC-6]

import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@shared/lib/supabase';

/**
 * Hook que solicita permissao de notificacao e registra o token push
 * do dispositivo na tabela users.expo_push_token.
 *
 * Deve ser chamado no root layout quando o usuario estiver autenticado.
 */
export function usePushNotifications(userId: string | undefined): void {
  useEffect(() => {
    if (!userId) return;
    registerForPushNotifications(userId);
  }, [userId]);
}

async function registerForPushNotifications(userId: string): Promise<void> {
  try {
    // Solicitar permissao de notificacao ao usuario
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      console.warn('usePushNotifications: permissao de notificacao negada');
      return;
    }

    // Obter o Expo Push Token do dispositivo
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    if (!token || !token.startsWith('ExponentPushToken[')) {
      console.warn('usePushNotifications: token invalido recebido:', token);
      return;
    }

    // Salvar token no banco de dados
    const { error } = await supabase
      .from('users')
      .update({ expo_push_token: token })
      .eq('id', userId);

    if (error) {
      console.error('usePushNotifications: erro ao salvar token:', error);
      return;
    }

    console.log('usePushNotifications: token registrado com sucesso');
  } catch (err) {
    // Falha silenciosa — notificacoes sao opcionais
    console.error('usePushNotifications: erro inesperado:', err);
  }
}
