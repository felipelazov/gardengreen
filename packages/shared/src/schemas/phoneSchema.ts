import { z } from 'zod';

export const phoneSchema = z.string()
  .regex(/^\+55\d{10,11}$/, 'Telefone invalido. Use formato com DDD.');

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(2);
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
}

export function formatPhoneToE164(digits: string): string {
  const clean = digits.replace(/\D/g, '');
  return `+55${clean}`;
}
