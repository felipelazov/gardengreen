import { formatCurrency, parseCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('formats whole values (100 cents = R$ 1,00)', () => {
    expect(formatCurrency(100)).toBe('R$ 1,00');
  });

  it('formats cents correctly', () => {
    expect(formatCurrency(150050)).toBe('R$ 1500,50');
  });

  it('formats small values', () => {
    expect(formatCurrency(1)).toBe('R$ 0,01');
  });

  it('formats negative values', () => {
    expect(formatCurrency(-500)).toBe('R$ -5,00');
  });

  it('formats large values', () => {
    expect(formatCurrency(1000000)).toBe('R$ 10000,00');
  });
});

describe('parseCurrency', () => {
  it('parses formatted currency back to cents', () => {
    expect(parseCurrency('R$ 1.500,50')).toBe(150050);
  });

  it('parses simple value', () => {
    expect(parseCurrency('R$ 10,00')).toBe(1000);
  });

  it('parses zero', () => {
    expect(parseCurrency('R$ 0,00')).toBe(0);
  });

  it('parses value with only digits and comma', () => {
    expect(parseCurrency('25,99')).toBe(2599);
  });
});
