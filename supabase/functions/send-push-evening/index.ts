// supabase/functions/send-push-evening/index.ts
// Edge Function — Push de Vespera
// Cron: 30 22 * * * (UTC) = 19:30 BRT (UTC-3)
// [Source: PRD EPIC-07, Story 7.2]

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
    // Buscar usuarios com push vespera ativo e token valido
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        expo_push_token,
        notification_preferences!inner (
          evening_enabled
        )
      `)
      .eq('notification_preferences.evening_enabled', true)
      .not('expo_push_token', 'is', null);

    if (usersError) {
      console.error('send-push-evening: erro ao buscar usuarios:', usersError);
      return new Response(JSON.stringify({ error: usersError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'Nenhum usuario com push vespera ativo' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Data de amanha no formato YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      const token = user.expo_push_token as string | null;
      if (!token || !token.startsWith('ExponentPushToken[')) {
        console.warn('send-push-evening: token invalido para usuario', user.id);
        skipped++;
        continue;
      }

      // Buscar servicos de amanha para este usuario
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
        .eq('date', tomorrowStr)
        .neq('status', 'cancelled')
        .order('time', { ascending: true });

      if (servicesError) {
        console.error('send-push-evening: erro ao buscar servicos do usuario', user.id, servicesError);
        continue;
      }

      // Sem servicos amanha — nao enviar push
      if (!services || services.length === 0) {
        skipped++;
        continue;
      }

      // Montar mensagem
      const count = services.length;
      const first = services[0];
      const firstClientName = ((first.clients as { name: string } | null)?.name ?? 'Cliente').split(' ')[0];
      // Formatar hora: pegar HH:MM dos primeiros 5 chars do campo time
      const hora = first.time ? first.time.substring(0, 5) : 'cedo';

      const title = 'Agenda de Amanha';
      const body = `Amanha voce tem ${count} cliente${count > 1 ? 's' : ''}. Primeiro as ${hora}: ${firstClientName}`;

      await sendPushNotification(token, title, body, { screen: 'agenda', date: tomorrowStr });
      sent++;
    }

    console.log(`send-push-evening: enviados=${sent}, pulados=${skipped}`);

    return new Response(
      JSON.stringify({ sent, skipped, date: tomorrowStr }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('send-push-evening: erro inesperado:', err);
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
