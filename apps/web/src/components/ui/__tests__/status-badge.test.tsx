import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge, statusMap } from '../status-badge';
import type { Status } from '../status-badge';

describe('StatusBadge', () => {
  const allStatuses: [Status, string][] = [
    ['scheduled', 'Agendado'],
    ['in_progress', 'Em andamento'],
    ['completed', 'Concluído'],
    ['cancelled', 'Cancelado'],
    ['draft', 'Rascunho'],
    ['sent', 'Enviado'],
    ['approved', 'Aprovado'],
    ['rejected', 'Rejeitado'],
    ['expired', 'Expirado'],
    ['active', 'Ativo'],
    ['inactive', 'Inativo'],
    ['invited', 'Convidado'],
    ['overdue', 'Atrasado'],
    ['pending', 'Pendente'],
    ['paid', 'Pago'],
  ];

  it.each(allStatuses)('renders "%s" status as "%s"', (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders unknown status with raw text as fallback', () => {
    // @ts-expect-error testing unknown status
    render(<StatusBadge status="unknown_status" />);
    expect(screen.getByText('unknown_status')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatusBadge status="completed" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has all 15 statuses in statusMap', () => {
    expect(Object.keys(statusMap)).toHaveLength(15);
  });
});
