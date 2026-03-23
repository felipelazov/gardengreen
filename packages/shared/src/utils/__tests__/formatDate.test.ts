import {
  formatDateBR,
  getWeekday,
  getMonthAbbr,
  isToday,
  getTodayStr,
  addDays,
  formatHeaderDate,
} from '../formatDate';

describe('formatDateBR', () => {
  it('formats date string to BR format dd/mm/yyyy', () => {
    expect(formatDateBR('2024-01-15')).toBe('15/01/2024');
  });

  it('formats date with single digit day and month', () => {
    expect(formatDateBR('2024-03-05')).toBe('05/03/2024');
  });

  it('formats end of year date', () => {
    expect(formatDateBR('2024-12-31')).toBe('31/12/2024');
  });
});

describe('getWeekday', () => {
  it('returns correct weekday abbreviation', () => {
    // 2024-01-15 is a Monday
    expect(getWeekday('2024-01-15')).toBe('Seg');
  });

  it('returns Dom for Sunday', () => {
    // 2024-01-14 is a Sunday
    expect(getWeekday('2024-01-14')).toBe('Dom');
  });

  it('returns Sab for Saturday', () => {
    // 2024-01-13 is a Saturday
    expect(getWeekday('2024-01-13')).toBe('Sab');
  });
});

describe('getMonthAbbr', () => {
  it('returns Jan for January', () => {
    expect(getMonthAbbr('2024-01-15')).toBe('Jan');
  });

  it('returns Dez for December', () => {
    expect(getMonthAbbr('2024-12-15')).toBe('Dez');
  });

  it('returns Jun for June', () => {
    expect(getMonthAbbr('2024-06-01')).toBe('Jun');
  });
});

describe('isToday', () => {
  it('returns true for today', () => {
    const today = new Date().toISOString().split('T')[0]!;
    expect(isToday(today)).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const str = yesterday.toISOString().split('T')[0]!;
    expect(isToday(str)).toBe(false);
  });
});

describe('getTodayStr', () => {
  it('returns today in YYYY-MM-DD format', () => {
    const result = getTodayStr();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result).toBe(new Date().toISOString().split('T')[0]);
  });
});

describe('addDays', () => {
  it('adds days to a date', () => {
    expect(addDays('2024-01-15', 5)).toBe('2024-01-20');
  });

  it('handles month overflow', () => {
    expect(addDays('2024-01-30', 3)).toBe('2024-02-02');
  });

  it('subtracts days with negative value', () => {
    expect(addDays('2024-01-15', -5)).toBe('2024-01-10');
  });
});

describe('formatHeaderDate', () => {
  it('formats header date with weekday, day and month', () => {
    // 2024-01-15 is Monday, January
    expect(formatHeaderDate('2024-01-15')).toBe('Seg, 15 de Jan');
  });

  it('formats another date correctly', () => {
    // 2024-06-01 is Saturday, June
    expect(formatHeaderDate('2024-06-01')).toBe('Sab, 1 de Jun');
  });
});
