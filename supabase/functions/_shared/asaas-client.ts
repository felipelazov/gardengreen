const ASAAS_API_URL =
  Deno.env.get('ASAAS_ENVIRONMENT') === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3';

/**
 * Realiza requisicao autenticada para a API do Asaas.
 * Lanca erro se o status HTTP nao for 2xx.
 */
export async function asaasRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = Deno.env.get('ASAAS_API_KEY');
  if (!apiKey) throw new Error('ASAAS_API_KEY nao configurada');

  const response = await fetch(`${ASAAS_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Asaas API error: ${response.status} ${body}`);
  }

  return response.json() as Promise<T>;
}
