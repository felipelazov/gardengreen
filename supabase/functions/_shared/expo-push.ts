const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  sound?: 'default' | null;
  data?: Record<string, unknown>;
}

/**
 * Envia uma push notification via Expo Push API.
 * Falha silenciosamente em caso de erro para nao interromper o fluxo principal.
 */
export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!token || !token.startsWith('ExponentPushToken[')) {
    console.warn('expo-push: token invalido, notificacao ignorada:', token);
    return;
  }

  const message: PushMessage = {
    to: token,
    title,
    body,
    sound: 'default',
    ...(data ? { data } : {}),
  };

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('expo-push: falha no envio:', response.status, text);
    }
  } catch (err) {
    console.error('expo-push: erro de rede:', err);
  }
}
