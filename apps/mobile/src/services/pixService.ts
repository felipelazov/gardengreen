import { supabase } from '@shared/lib/supabase';

export interface PixResponse {
  payment_id: string;
  /** QR Code como string base64 (formato PNG) */
  qr_code: string;
  /** Codigo PIX copia e cola */
  copy_paste: string;
  /** Link de pagamento do Asaas */
  link: string;
  /** ISO 8601 — expiracao em 24h */
  expires_at: string;
}

/**
 * Gera uma cobranca PIX via Edge Function generate-pix.
 * Lanca erro com mensagem amigavel em caso de falha.
 */
export async function generatePix(
  serviceId: string,
  amount: number,
): Promise<PixResponse> {
  const { data, error } = await supabase.functions.invoke<PixResponse>('generate-pix', {
    body: { service_id: serviceId, amount },
  });

  if (error) {
    console.error('pixService.generatePix error:', error);
    throw new Error('Nao foi possivel gerar o PIX. Tente novamente.');
  }

  if (!data) {
    throw new Error('Nao foi possivel gerar o PIX. Tente novamente.');
  }

  return data;
}
