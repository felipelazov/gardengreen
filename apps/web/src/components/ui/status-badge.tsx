'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'draft'
  | 'sent'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'active'
  | 'inactive'
  | 'invited'
  | 'overdue'
  | 'pending'
  | 'paid';

interface StatusConfig {
  label: string;
  className: string;
}

const statusMap: Record<Status, StatusConfig> = {
  scheduled: {
    label: 'Agendado',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  completed: {
    label: 'Concluído',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  draft: {
    label: 'Rascunho',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  sent: {
    label: 'Enviado',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  approved: {
    label: 'Aprovado',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rejected: {
    label: 'Rejeitado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  expired: {
    label: 'Expirado',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  active: {
    label: 'Ativo',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  invited: {
    label: 'Convidado',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  overdue: {
    label: 'Atrasado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  paid: {
    label: 'Pago',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
};

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: Status;
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusMap[status];

  if (!config) {
    return (
      <Badge variant="secondary" className={className} {...props}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn('border font-medium', config.className, className)}
      {...props}
    >
      {config.label}
    </Badge>
  );
}

export { StatusBadge, statusMap };
export type { Status, StatusBadgeProps };
