// supabase/functions/send-push-morning/index.ts
// Edge Function — Push Matinal "Seus Clientes de Hoje"
// Cron: 30 8 * * * (UTC) = 05:30 BRT (UTC-3)
// [Source: PRD EPIC-07, Story 7.1]

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendPushNotification } from '../_shared/expo-push.ts';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  // Suporte a CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Buscar usuarios com push matinal ativo e token valido
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        expo_push_token,
        notification_preferences!inner (
          morning_enabled
        )
      `)
      .eq('notification_preferences.morning_enabled', true)
      .not('expo_push_token', 'is', null);

    if (usersError) {
      console.error('send-push-morning: erro ao buscar usuarios:', usersError);
      return new Response(JSON.stringify({ error: usersError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'Nenhum usuario com push matinal ativo' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Data de hoje no formato YYYY-MM-DD (timezone do servidor)
    const today = new Date().toISOString().split('T')[0];

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      const token = user.expo_push_token as string | null;
      if (!token || !token.startsWith('ExponentPushToken[')) {
        console.warn('send-push-morning: token invalido para usuario', user.id);
        skipped++;
        continue;
      }

      // Buscar servicos de hoje para este usuario
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select(`
          id,
          time,
          clients (
            name
          )
        `)
        .eq('user_id', user.id)
        .eq('date', today)
        .neq('status', 'cancelled')
        .order('time', { ascending: true });

      if (servicesError) {
        console.error('send-push-morning: erro ao buscar servicos do usuario', user.id, servicesError);
        continue;
      }

      // Sem servicos hoje — nao enviar push
      if (!services || services.length === 0) {
        skipped++;
        continue;
      }

      // Montar mensagem
      const firstName = (user.name as string).split(' ')[0];
      const count = services.length;
      const names = services.map((s) => (s.clients as { name: string } | null)?.name ?? 'Cliente');

      let body: string;
      if (count <= 3) {
        body = `Hoje voce tem ${count} cliente${count > 1 ? 's' : ''}: ${names.join(', ')}`;
      } else {
        const extra = count - 3;
        body = `Hoje voce tem ${count} clientes: ${names.slice(0, 3).join(', ')} e mais ${extra}`;
      }

      const title = `Bom dia, ${firstName}!`;

      await sendPushNotification(token, title, body, { screen: 'agenda', date: today });
      sent++;
    }

    console.log(`send-push-morning: enviados=${sent}, pulados=${skipped}`);

    return new Response(
      JSON.stringify({ sent, skipped, date: today }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('send-push-morning: erro inesperado:', err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
