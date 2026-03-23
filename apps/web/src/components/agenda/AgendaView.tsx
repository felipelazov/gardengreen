'use client';

import { useState, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewServiceDialog } from './NewServiceDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  title: string;
  scheduled_date: string;
  start_time: string;
  end_time: string | null;
  status: string;
  price: number;
  notes: string | null;
  client_id: string;
  clients: { id: string; name: string; phone: string; address: string | null } | null;
}

interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

const statusColors: Record<string, string> = {
  scheduled: '#16A34A',
  in_progress: '#3b82f6',
  completed: '#9ca3af',
  cancelled: '#ef4444',
};

export function AgendaView({ initialServices, clients }: { initialServices: Service[]; clients: ClientOption[] }) {
  const [showNewService, setShowNewService] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const events = useMemo(() =>
    initialServices.map((s) => ({
      id: s.id,
      title: `${s.clients?.name ?? 'Cliente'} - ${s.title}`,
      start: `${s.scheduled_date}T${s.start_time}`,
      end: s.end_time ? `${s.scheduled_date}T${s.end_time}` : undefined,
      backgroundColor: statusColors[s.status] ?? '#16A34A',
      borderColor: statusColors[s.status] ?? '#16A34A',
      extendedProps: { service: s },
    })),
    [initialServices]
  );

  function handleEventDrop(info: any) {
    setPendingDrop(info);
    setConfirmOpen(true);
  }

  const confirmReschedule = useCallback(async () => {
    if (!pendingDrop) return;
    const info = pendingDrop;
    const newDate = info.event.start.toISOString().split('T')[0];
    const newTime = info.event.start.toTimeString().slice(0, 8);

    const { error } = await supabase
      .from('services')
      .update({ scheduled_date: newDate, start_time: newTime })
      .eq('id', info.event.id);

    if (error) {
      info.revert();
      toast('Erro ao reagendar. Tente novamente.', 'error');
    } else {
      toast('Servico reagendado com sucesso!', 'success');
      router.refresh();
    }
    setPendingDrop(null);
  }, [pendingDrop, supabase, router, toast]);

  const cancelReschedule = useCallback(() => {
    if (pendingDrop) {
      pendingDrop.revert();
      setPendingDrop(null);
    }
  }, [pendingDrop]);

  function handleDateClick(info: any) {
    setSelectedDate(info.dateStr);
    setShowNewService(true);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setSelectedDate(null); setShowNewService(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Novo Servico
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mes',
              week: 'Semana',
              day: 'Dia',
            }}
            events={events}
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            dateClick={handleDateClick}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
          />
        </CardContent>
      </Card>

      <NewServiceDialog
        clients={clients}
        defaultDate={selectedDate}
        open={showNewService}
        onOpenChange={setShowNewService}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) cancelReschedule();
        }}
        title="Reagendar servico"
        description={pendingDrop ? `Deseja reagendar o servico para ${pendingDrop.event.start.toISOString().split('T')[0]}?` : ''}
        confirmLabel="Reagendar"
        cancelLabel="Cancelar"
        onConfirm={confirmReschedule}
      />
    </>
  );
}
