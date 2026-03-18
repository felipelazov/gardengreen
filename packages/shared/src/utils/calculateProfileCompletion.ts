import type { User } from '../types/database';

const FIELD_WEIGHTS: Record<string, number> = {
  name: 20,
  avatar_url: 15,
  phone: 10,
  email: 10,
  city: 10,
  service_type: 10,
  cnpj_mei: 10,
  address: 10,
  // total when all filled = 95, remaining 5% from having onboarding done
};

export function calculateProfileCompletion(user: User): number {
  let score = user.onboarding_completed ? 5 : 0;

  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const value = user[field as keyof User];
    if (value !== null && value !== undefined && value !== '') {
      score += weight;
    }
  }

  return Math.min(100, score);
}
