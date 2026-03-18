const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export function formatDateBR(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function getWeekday(dateStr: string): string {
  return WEEKDAYS[new Date(dateStr + 'T12:00:00').getDay()];
}

export function getMonthAbbr(dateStr: string): string {
  return MONTHS[new Date(dateStr + 'T12:00:00').getMonth()];
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekDates(offset: number = 0): string[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function formatHeaderDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${getWeekday(dateStr)}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}
