import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';

interface AlertsPanelProps {
  alerts: {
    overdue: { id: string; clientName: string }[];
    oldQuotes: { id: string; clientName: string }[];
  };
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const hasAlerts = alerts.overdue.length > 0 || alerts.oldQuotes.length > 0;

  if (!hasAlerts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            Atencao
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Tudo em ordem! Nenhum alerta pendente.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber" />
          Atencao
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.overdue.map((item) => (
          <Link
            key={item.id}
            href="/dashboard/financeiro"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="bg-red-50 text-red-600 p-2 rounded-lg">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Cobranca vencida</p>
              <p className="text-xs text-muted-foreground">{item.clientName}</p>
            </div>
          </Link>
        ))}
        {alerts.oldQuotes.map((item) => (
          <Link
            key={item.id}
            href="/dashboard/orcamentos"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Orcamento sem resposta</p>
              <p className="text-xs text-muted-foreground">{item.clientName} (7+ dias)</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
