import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendPushNotification } from '../_shared/expo-push.ts';

interface TeamNotificationPayload {
  service_id: string;
  member_id: string;
  type: 'assigned' | 'reassigned' | 'unassigned';
  client_name: string;
  service_date: string;
  old_member_id?: string;
}

Deno.serve(async (req: Request) => {
  // Apenas POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: TeamNotificationPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { service_id, member_id, type, client_name, service_date, old_member_id } = payload;

  if (!service_id || !member_id || !type || !client_name || !service_date) {
    return new Response(
      JSON.stringify({ error: 'Campos obrigatorios: service_id, member_id, type, client_name, service_date' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Formata data para exibicao
  const [year, month, day] = service_date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  try {
    // Notifica o novo membro (assigned/reassigned)
    if (type === 'assigned' || type === 'reassigned') {
      const { data: newMember, error: newMemberError } = await supabase
        .from('team_members')
        .select('push_token, name')
        .eq('id', member_id)
        .single();

      if (newMemberError) {
        console.error('Erro ao buscar novo membro:', newMemberError);
      } else if (newMember?.push_token) {
        await sendPushNotification(
          newMember.push_token,
          'Novo servico atribuido',
          `${client_name} em ${formattedDate}`,
          { service_id, type: 'team_assignment' },
        );
      }
    }

    // Notifica o membro anterior (reassigned/unassigned)
    if ((type === 'reassigned' || type === 'unassigned') && old_member_id) {
      const { data: oldMember, error: oldMemberError } = await supabase
        .from('team_members')
        .select('push_token, name')
        .eq('id', old_member_id)
        .single();

      if (oldMemberError) {
        console.error('Erro ao buscar membro anterior:', oldMemberError);
      } else if (oldMember?.push_token) {
        await sendPushNotification(
          oldMember.push_token,
          'Servico removido da sua agenda',
          `${client_name} em ${formattedDate}`,
          { service_id, type: 'team_unassignment' },
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('send-team-notification erro:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao enviar notificacao' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
