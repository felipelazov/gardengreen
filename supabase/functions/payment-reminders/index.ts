import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';
import { sendPushNotification } from '../_shared/expo-push.ts';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PaymentWithUser {
  id: string;
  amount: number;
  created_at: string;
  last_reminder_at: string | null;
  users: {
    push_token: string | null;
    reminder_interval_days: number | null;
    name: string;
  } | null;
  clients: {
    name: string;
  } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function diffInDays(dateA: Date, dateB: Date): number {
  const diff = dateA.getTime() - dateB.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function wasSentInLast24h(lastReminderAt: string | null): boolean {
  if (!lastReminderAt) return false;
  const lastSent = new Date(lastReminderAt);
  const diff = Date.now() - lastSent.getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
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

    // Verificar autorizacao (chamado pelo cron via service role ou token especifico)
    const authHeader = req.headers.get('Authorization');
    const cronSecret = Deno.env.get('CRON_SECRET');

    if (cronSecret) {
      const provided = authHeader?.replace('Bearer ', '');
      if (provided !== cronSecret) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    const today = new Date();
    let remindersEnviados = 0;
    let pagamentosProcessados = 0;

    // Buscar todos os pagamentos pendentes com dados do usuario e cliente
    const { data: payments, error: fetchError } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        created_at,
        last_reminder_at,
        users (
          push_token,
          reminder_interval_days,
          name
        ),
        clients (
          name
        )
      `)
      .eq('status', 'pending')
      .is('paid_at', null);

    if (fetchError) {
      throw new Error(`Erro ao buscar pagamentos: ${fetchError.message}`);
    }

    const pendingPayments = (payments ?? []) as unknown as PaymentWithUser[];
    pagamentosProcessados = pendingPayments.length;

    console.log(`payment-reminders: processando ${pagamentosProcessados} pagamentos pendentes`);

    for (const payment of pendingPayments) {
      const userToken = payment.users?.push_token ?? null;
      if (!userToken) continue;

      // Intervalo configurado pelo usuario (default: 3 dias)
      const intervalDays = payment.users?.reminder_interval_days ?? 3;

      // Dias desde criacao do pagamento
      const createdAt = new Date(payment.created_at);
      const daysPending = diffInDays(today, createdAt);

      // Verificar se e dia de enviar lembrete (multiplo do intervalo)
      const shouldSendByInterval = daysPending > 0 && daysPending % intervalDays === 0;
      if (!shouldSendByInterval) continue;

      // Verificar se ja foi enviado nas ultimas 24h (evitar duplicatas)
      if (wasSentInLast24h(payment.last_reminder_at)) continue;

      const clientName = payment.clients?.name ?? 'Cliente';
      const valor = formatBRL(payment.amount);

      // Enviar push notification
      await sendPushNotification(
        userToken,
        'Cobranca pendente',
        `${clientName} - ${valor} (${daysPending} ${daysPending === 1 ? 'dia' : 'dias'} pendente)`,
        { payment_id: payment.id, type: 'payment_reminder' },
      );

      // Atualizar last_reminder_at
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          last_reminder_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      if (updateError) {
        console.error(`payment-reminders: erro ao atualizar ${payment.id}:`, updateError.message);
      } else {
        remindersEnviados++;
        console.log(`payment-reminders: lembrete enviado para pagamento ${payment.id}`);
      }
    }

    const resultado = {
      processados: pagamentosProcessados,
      lembretes_enviados: remindersEnviados,
      timestamp: new Date().toISOString(),
    };

    console.log('payment-reminders: concluido:', resultado);

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno';
    console.error('payment-reminders error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
