// generate-monthly-report — Edge Function
// Cron: 0 6 1 * * (dia 1 de cada mes, 06:00 UTC = 03:00 BRT)
//
// Responsabilidades:
// 1. Para cada usuario com onboarding_completed=true:
//    - Calcular receita, despesas, lucro, servicos, clientes, pendentes do mes anterior
//    - Inserir em monthly_reports
//    - Enviar push notification via Expo Push API

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MonthlyReportInsert {
  user_id: string;
  month: number;
  year: number;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  services_completed: number;
  clients_served: number;
  pending_total: number;
}

interface UserRow {
  id: string;
  push_token: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPreviousMonthRange(): {
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  startTs: number;
  endTs: number;
} {
  const now = new Date();
  let month = now.getMonth(); // 0-indexed, so this is "previous month"
  let year = now.getFullYear();

  if (month === 0) {
    month = 12;
    year -= 1;
  }

  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const pad = (n: number) => String(n).padStart(2, '0');
  const startDate = `${year}-${pad(month)}-01`;
  const lastDay = end.getDate();
  const endDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  return {
    month,
    year,
    startDate,
    endDate,
    startTs: start.getTime(),
    endTs: end.getTime(),
  };
}

const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatBRL(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// ---------------------------------------------------------------------------
// Main Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // Validacao de seguranca basica para invocacao manual
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response('Missing environment variables', { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const range = getPreviousMonthRange();
  const monthName = MONTH_NAMES_PT[range.month - 1];

  console.log(`[generate-monthly-report] Processing month: ${monthName} ${range.year}`);

  // Buscar todos os usuarios com onboarding concluido
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id')
    .eq('onboarding_completed', true);

  if (usersError) {
    console.error('[generate-monthly-report] Error fetching users:', usersError);
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!users || users.length === 0) {
    console.log('[generate-monthly-report] No users to process');
    return new Response(JSON.stringify({ processed: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`[generate-monthly-report] Processing ${users.length} users`);

  const results = await Promise.allSettled(
    users.map((user: { id: string }) => processUser(supabase, user.id, range, monthName)),
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  console.log(`[generate-monthly-report] Done. Succeeded: ${succeeded}, Failed: ${failed}`);

  return new Response(
    JSON.stringify({ processed: users.length, succeeded, failed }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
});

// ---------------------------------------------------------------------------
// processUser — gera relatorio para um usuario
// ---------------------------------------------------------------------------

async function processUser(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  range: ReturnType<typeof getPreviousMonthRange>,
  monthName: string,
): Promise<void> {
  try {
    // Pagamentos recebidos no mes
    const { data: paidPayments, error: paidError } = await supabase
      .from('payments')
      .select('amount, service_id, client_id')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .gte('paid_at', range.startTs)
      .lte('paid_at', range.endTs);

    if (paidError) throw new Error(`Payments query error: ${paidError.message}`);

    // Despesas do mes
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('date', range.startDate)
      .lte('date', range.endDate);

    if (expensesError) throw new Error(`Expenses query error: ${expensesError.message}`);

    // Pagamentos pendentes (todos, nao so do mes)
    const { data: pendingPayments, error: pendingError } = await supabase
      .from('payments')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (pendingError) throw new Error(`Pending query error: ${pendingError.message}`);

    // Calcular agregados
    const totalRevenue = (paidPayments ?? []).reduce(
      (acc: number, p: { amount: number }) => acc + (p.amount ?? 0),
      0,
    );
    const totalExpenses = (expenses ?? []).reduce(
      (acc: number, e: { amount: number }) => acc + (e.amount ?? 0),
      0,
    );
    const pendingTotal = (pendingPayments ?? []).reduce(
      (acc: number, p: { amount: number }) => acc + (p.amount ?? 0),
      0,
    );
    const netProfit = totalRevenue - totalExpenses;

    const serviceIds = new Set(
      (paidPayments ?? [])
        .map((p: { service_id: string | null }) => p.service_id)
        .filter(Boolean),
    );
    const clientIds = new Set(
      (paidPayments ?? [])
        .map((p: { client_id: string | null }) => p.client_id)
        .filter(Boolean),
    );
    const servicesCompleted = serviceIds.size;
    const clientsServed = clientIds.size;

    // Inserir ou atualizar relatorio
    const report: MonthlyReportInsert = {
      user_id: userId,
      month: range.month,
      year: range.year,
      total_revenue: totalRevenue,
      total_expenses: totalExpenses,
      net_profit: netProfit,
      services_completed: servicesCompleted,
      clients_served: clientsServed,
      pending_total: pendingTotal,
    };

    const { error: insertError } = await supabase
      .from('monthly_reports')
      .upsert(report, { onConflict: 'user_id,month,year' });

    if (insertError) throw new Error(`Insert error: ${insertError.message}`);

    console.log(
      `[generate-monthly-report] Report saved for user ${userId}: revenue=${totalRevenue}, expenses=${totalExpenses}`,
    );

    // Buscar push token
    const { data: notifPref } = await supabase
      .from('notification_preferences')
      .select('push_token')
      .eq('user_id', userId)
      .single();

    const pushToken = notifPref?.push_token;

    if (pushToken) {
      await sendPushNotification(
        pushToken,
        `Seu relatorio de ${monthName} esta pronto!`,
        `Voce ganhou ${formatBRL(totalRevenue)} em ${monthName}.`,
        { type: 'monthly_report', month: range.month, year: range.year },
      );
    }
  } catch (err) {
    console.error(`[generate-monthly-report] Error processing user ${userId}:`, err);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// sendPushNotification — via Expo Push API
// ---------------------------------------------------------------------------

async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        data,
        sound: 'default',
        priority: 'normal',
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`[push] Failed to send push notification: ${response.status} ${text}`);
    } else {
      console.log(`[push] Notification sent to ${token.substring(0, 20)}...`);
    }
  } catch (err) {
    console.error('[push] Error sending push notification:', err);
  }
}
