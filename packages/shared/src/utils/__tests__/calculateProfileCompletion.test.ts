import { calculateProfileCompletion } from '../calculateProfileCompletion';
import type { User } from '../../types/database';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: '',
    phone: null,
    email: null,
    city: null,
    service_type: null,
    avatar_url: null,
    cnpj_mei: null,
    address: null,
    plan: 'free',
    role: 'gardener',
    team_id: null,
    onboarding_completed: false,
    profile_completion: 0,
    expo_push_token: null,
    timezone: 'America/Sao_Paulo',
    stripe_customer_id: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('calculateProfileCompletion', () => {
  it('returns 0 for empty profile (no onboarding, no fields)', () => {
    const user = makeUser();
    expect(calculateProfileCompletion(user)).toBe(0);
  });

  it('returns 5 for onboarding completed only', () => {
    const user = makeUser({ onboarding_completed: true });
    expect(calculateProfileCompletion(user)).toBe(5);
  });

  it('returns 20 for name only', () => {
    const user = makeUser({ name: 'Joao' });
    expect(calculateProfileCompletion(user)).toBe(20);
  });

  it('returns partial score for some fields filled', () => {
    const user = makeUser({
      name: 'Joao',
      phone: '11999887766',
      email: 'joao@test.com',
      onboarding_completed: true,
    });
    // name(20) + phone(10) + email(10) + onboarding(5) = 45
    expect(calculateProfileCompletion(user)).toBe(45);
  });

  it('returns 100 for fully completed profile', () => {
    const user = makeUser({
      name: 'Joao Silva',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '11999887766',
      email: 'joao@test.com',
      city: 'Sao Paulo',
      service_type: 'landscaping',
      cnpj_mei: '12345678901234',
      address: 'Rua das Flores, 123',
      onboarding_completed: true,
    });
    // All fields: 20+15+10+10+10+10+10+10+5 = 100
    expect(calculateProfileCompletion(user)).toBe(100);
  });

  it('caps at 100', () => {
    const user = makeUser({
      name: 'Joao Silva',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '11999887766',
      email: 'joao@test.com',
      city: 'Sao Paulo',
      service_type: 'landscaping',
      cnpj_mei: '12345678901234',
      address: 'Rua das Flores, 123',
      onboarding_completed: true,
    });
    expect(calculateProfileCompletion(user)).toBeLessThanOrEqual(100);
  });

  it('does not count empty string as filled', () => {
    const user = makeUser({ name: '' });
    expect(calculateProfileCompletion(user)).toBe(0);
  });
});
