import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';
import { sendPushNotification } from '../_shared/expo-push.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AsaasEvent = 'PAYMENT_RECEIVED' | 'PAYMENT_CONFIRMED' | 'PAYMENT_OVERDUE' | 'PAYMENT_DELETED';

interface AsaasWebhookPayload {
  event: AsaasEvent;
  payment: {
    id: string;
    value: number;
    netValue: number;
    status: string;
    externalReference?: string;
    customer: string;
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Apenas POST e aceito
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Validar webhook token do Asaas (header access_token)
    const webhookToken = req.headers.get('access_token') ?? req.headers.get('asaas-access-token');
    const expectedToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN');

    if (expectedToken && webhookToken !== expectedToken) {
      console.warn('pix-webhook: token invalido, requisicao rejeitada');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = (await req.json()) as AsaasWebhookPayload;
    const { event, payment } = payload;

    console.log(`pix-webhook: evento recebido: ${event}, payment_id: ${payment.id}`);

    // Buscar pagamento local pelo pix_transaction_id
    const { data: localPayment, error: findError } = await supabase
      .from('payments')
      .select('id, user_id, amount, status')
      .eq('pix_transaction_id', payment.id)
      .single();

    if (findError || !localPayment) {
      // Pagamento nao registrado localmente — pode ser de outro sistema, ignorar
      console.warn(`pix-webhook: pagamento ${payment.id} nao encontrado localmente`);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Processar evento
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      await supabase
        .from('payments')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', localPayment.id);

      // Enviar push notification ao jardineiro
      const { data: userData } = await supabase
        .from('users')
        .select('push_token, name')
        .eq('id', localPayment.user_id)
        .single();

      if (userData?.push_token) {
        const valor = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(localPayment.amount);

        await sendPushNotification(
          userData.push_token,
          'Pagamento recebido!',
          `Voce recebeu ${valor} via PIX.`,
          { payment_id: localPayment.id, type: 'payment_received' },
        );
      }

      console.log(`pix-webhook: pagamento ${localPayment.id} marcado como pago`);
    } else if (event === 'PAYMENT_OVERDUE') {
      await supabase
        .from('payments')
        .update({
          status: 'overdue',
          updated_at: new Date().toISOString(),
        })
        .eq('id', localPayment.id);

      console.log(`pix-webhook: pagamento ${localPayment.id} marcado como overdue`);
    } else {
      console.log(`pix-webhook: evento ${event} ignorado`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('pix-webhook error:', message);
    // Retornar 200 mesmo em erro para evitar retries do Asaas
    return new Response(JSON.stringify({ received: true, error: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
