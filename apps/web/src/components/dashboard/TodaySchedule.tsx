import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Clock, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Status } from '@/components/ui/status-badge';

interface Service {
  id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  status: string;
  price: number;
  clients: { name: string; phone: string; address: string | null } | null;
}

export function TodaySchedule({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Agenda de hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🌿</span>
            <p className="font-semibold text-foreground">Sem servicos hoje</p>
            <p className="text-sm text-muted-foreground mt-1">Aproveite para enviar orcamentos!</p>
            <div className="flex gap-2 justify-center mt-4">
              <Link href="/dashboard/orcamentos" className="text-sm text-primary font-medium hover:underline">
                Criar orcamento
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link href="/dashboard/agenda" className="text-sm text-primary font-medium hover:underline">
                Agendar servico
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Agenda de hoje ({services.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => {
          const isCompleted = service.status === 'completed';
          return (
            <div
              key={service.id}
              className={`flex items-center gap-4 p-3 rounded-lg border border-border ${isCompleted ? 'opacity-50' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{service.clients?.name ?? 'Cliente'}</p>
                  <StatusBadge status={service.status as Status} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.start_time?.slice(0, 5)}
                    {service.end_time && ` - ${service.end_time.slice(0, 5)}`}
                  </span>
                  {service.clients?.address && (
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" />
                      {service.clients.address}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-green-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
