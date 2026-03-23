import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricCard } from '../metric-card';
import type { LucideIcon } from 'lucide-react';

// Mock a simple Lucide icon component
const MockIcon: LucideIcon = React.forwardRef((props, ref) => (
  <svg ref={ref} data-testid="mock-icon" {...props} />
)) as unknown as LucideIcon;
MockIcon.displayName = 'MockIcon';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Total Clientes" value={42} icon={MockIcon} />);
    expect(screen.getByText('Total Clientes')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<MetricCard title="Receita" value="R$ 1.500,00" icon={MockIcon} />);
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<MetricCard title="Servicos" value={10} icon={MockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders positive change in green', () => {
    const { container } = render(
      <MetricCard title="Receita" value="R$ 5.000" change="+12%" icon={MockIcon} />
    );
    const changeEl = screen.getByText('+12%');
    expect(changeEl).toBeInTheDocument();
    expect(changeEl.className).toContain('text-green-600');
  });

  it('renders negative change in red', () => {
    render(
      <MetricCard title="Despesas" value="R$ 800" change="-5%" icon={MockIcon} />
    );
    const changeEl = screen.getByText('-5%');
    expect(changeEl).toBeInTheDocument();
    expect(changeEl.className).toContain('text-red-600');
  });

  it('renders neutral change with muted color', () => {
    render(
      <MetricCard title="Total" value={100} change="0%" icon={MockIcon} />
    );
    const changeEl = screen.getByText('0%');
    expect(changeEl).toBeInTheDocument();
    expect(changeEl.className).toContain('text-muted-foreground');
  });

  it('does not render change when not provided', () => {
    const { container } = render(
      <MetricCard title="Itens" value={5} icon={MockIcon} />
    );
    // Only title and value paragraphs
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
  });

  it('applies custom className', () => {
    const { container } = render(
      <MetricCard title="Test" value={1} icon={MockIcon} className="extra-class" />
    );
    expect(container.firstChild).toHaveClass('extra-class');
  });
});
