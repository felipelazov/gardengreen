import { applyPhoneMask } from '../formatPhone';

describe('applyPhoneMask', () => {
  it('returns empty for empty input', () => {
    expect(applyPhoneMask('')).toBe('');
  });

  it('returns digits only for 1-2 digits', () => {
    expect(applyPhoneMask('1')).toBe('1');
    expect(applyPhoneMask('11')).toBe('11');
  });

  it('formats DDD + partial number (3-7 digits)', () => {
    expect(applyPhoneMask('119')).toBe('(11) 9');
    expect(applyPhoneMask('1199887')).toBe('(11) 99887');
  });

  it('formats full phone number (8+ digits)', () => {
    expect(applyPhoneMask('11998877665')).toBe('(11) 99887-7665');
  });

  it('strips non-digit characters', () => {
    expect(applyPhoneMask('(11) 99887-7665')).toBe('(11) 99887-7665');
  });

  it('truncates to 11 digits max', () => {
    expect(applyPhoneMask('119988776650000')).toBe('(11) 99887-7665');
  });

  it('handles partial 8 digit numbers', () => {
    expect(applyPhoneMask('11998877')).toBe('(11) 99887-7');
  });
});
