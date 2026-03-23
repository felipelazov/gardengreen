'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: string;
  bg?: string;
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'text-primary',
  bg = 'bg-primary/10',
  className,
  ...props
}: MetricCardProps) {
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');

  return (
    <Card className={cn('p-6', className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                isPositive && 'text-green-600',
                isNegative && 'text-red-600',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', bg)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
      </div>
    </Card>
  );
}

export { MetricCard };
export type { MetricCardProps };
