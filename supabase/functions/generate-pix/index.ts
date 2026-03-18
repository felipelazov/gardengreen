import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';
import { asaasRequest } from '../_shared/asaas-client.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RequestBody {
  service_id: string;
  amount: number; // em reais
}

interface AsaasCreatePaymentResponse {
  id: string;
  invoiceUrl: string;
  status: string;
}

interface AsaasPixQrCodeResponse {
  encodedImage: string; // base64 PNG
  payload: string; // copia e cola
  expirationDate: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Autenticar usuario via JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) throw new Error('Unauthorized');

    // Ler body
    const body = (await req.json()) as RequestBody;
    const { service_id, amount } = body;

    if (!service_id) throw new Error('service_id e obrigatorio');
    if (!amount || amount <= 0) throw new Error('amount deve ser maior que zero');

    // Buscar servico + cliente
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, user_id, client_id, clients(id, name, email, phone)')
      .eq('id', service_id)
      .eq('user_id', user.id)
      .single();

    if (serviceError || !service) throw new Error('Servico nao encontrado');

    const client = service.clients as {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
    } | null;

    if (!client) throw new Error('Cliente do servico nao encontrado');

    // Buscar customer Asaas do usuario (ou criar)
    const asaasCustomerId = await getOrCreateAsaasCustomer(client);

    // Criar cobranca PIX no Asaas
    const asaasPayment = await asaasRequest<AsaasCreatePaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        customer: asaasCustomerId,
        billingType: 'PIX',
        value: amount,
        dueDate: getTomorrowDate(),
        description: `Servico de jardinagem - ${client.name}`,
        externalReference: service_id,
      }),
    });

    // Buscar QR Code do PIX
    const qrCodeData = await asaasRequest<AsaasPixQrCodeResponse>(
      `/payments/${asaasPayment.id}/pixQrCode`,
    );

    // Calcular expiracao (24h a partir de agora)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Salvar pagamento no banco
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        service_id,
        user_id: user.id,
        client_id: client.id,
        amount,
        method: 'pix',
        status: 'pending',
        pix_transaction_id: asaasPayment.id,
        pix_link: asaasPayment.invoiceUrl,
      })
      .select('id')
      .single();

    if (insertError || !payment) {
      console.error('Erro ao salvar pagamento:', insertError);
      throw new Error('Erro ao registrar pagamento');
    }

    // Retornar dados do PIX
    return new Response(
      JSON.stringify({
        payment_id: payment.id,
        qr_code: qrCodeData.encodedImage,
        copy_paste: qrCodeData.payload,
        link: asaasPayment.invoiceUrl,
        expires_at: expiresAt,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('generate-pix error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface AsaasCustomerResponse {
  id: string;
}

interface AsaasCustomerListResponse {
  data: Array<{ id: string }>;
}

/** Busca ou cria o customer no Asaas pelo email/telefone do cliente */
async function getOrCreateAsaasCustomer(client: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}): Promise<string> {
  // Tentar buscar por externalReference (client.id do nosso sistema)
  try {
    const existing = await asaasRequest<AsaasCustomerListResponse>(
      `/customers?externalReference=${client.id}&limit=1`,
    );
    if (existing.data && existing.data.length > 0) {
      return existing.data[0].id;
    }
  } catch {
    // Ignorar erro de busca, tentar criar
  }

  // Criar novo customer
  const created = await asaasRequest<AsaasCustomerResponse>('/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: client.name,
      email: client.email ?? undefined,
      mobilePhone: client.phone ? client.phone.replace(/\D/g, '') : undefined,
      externalReference: client.id,
    }),
  });

  return created.id;
}

/** Retorna a data de amanha no formato YYYY-MM-DD (timezone UTC-3 Brasil) */
function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Formatar como YYYY-MM-DD
  return tomorrow.toISOString().split('T')[0];
}
