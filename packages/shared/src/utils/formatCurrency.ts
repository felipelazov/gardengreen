export function formatCurrency(valueInCents: number): string {
  return `R$ ${(valueInCents / 100).toFixed(2).replace('.', ',')}`;
}

export function parseCurrency(display: string): number {
  return Math.round(
    parseFloat(display.replace(/[^\d,]/g, '').replace(',', '.')) * 100,
  );
}
