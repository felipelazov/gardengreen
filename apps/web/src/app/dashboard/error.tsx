'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <span className="text-5xl">🌱</span>
      <h2 className="text-xl font-bold text-foreground">Algo deu errado</h2>
      <p className="text-muted-foreground text-sm max-w-md text-center">
        Ocorreu um erro ao carregar esta página. Tente novamente ou volte para o início.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
