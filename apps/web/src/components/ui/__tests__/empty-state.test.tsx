import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nenhum item" />);
    expect(screen.getByText('Nenhum item')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(
      <EmptyState
        title="Nenhum item"
        description="Comece adicionando um novo item."
      />
    );
    expect(screen.getByText('Nenhum item')).toBeInTheDocument();
    expect(screen.getByText('Comece adicionando um novo item.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Vazio" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="Nenhum cliente"
        action={<button>Adicionar cliente</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Adicionar cliente' })).toBeInTheDocument();
  });

  it('does not render action wrapper when not provided', () => {
    const { container } = render(<EmptyState title="Vazio" />);
    // Only the h3 title should be a direct child text element
    expect(container.querySelector('h3')).toHaveTextContent('Vazio');
  });

  it('renders icon when provided', () => {
    render(
      <EmptyState
        title="Vazio"
        icon={<svg data-testid="test-icon" />}
      />
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="Vazio" className="my-custom-class" />
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
