import { useAuthStore } from '../authStore';
import type { User } from '@shared/types/database';

const mockUser: User = {
  id: 'test-uuid',
  name: 'Joao Jardineiro',
  phone: '+5511999887766',
  email: 'joao@gmail.com',
  city: 'Sao Paulo',
  service_type: 'manutencao',
  avatar_url: null,
  cnpj_mei: null,
  address: null,
  plan: 'free',
  role: 'gardener',
  team_id: null,
  onboarding_completed: false,
  profile_completion: 20,
  expo_push_token: null,
  timezone: 'America/Sao_Paulo',
  stripe_customer_id: null,
  created_at: '2026-03-17T00:00:00Z',
  updated_at: '2026-03-17T00:00:00Z',
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isOnboarded: false,
      isLoading: true,
    });
  });

  it('should set user and derive auth state', () => {
    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isOnboarded).toBe(false);
  });

  it('should set isOnboarded when user has completed onboarding', () => {
    const onboardedUser = { ...mockUser, onboarding_completed: true };
    useAuthStore.getState().setUser(onboardedUser);

    expect(useAuthStore.getState().isOnboarded).toBe(true);
  });

  it('should clear state on setUser(null)', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setUser(null);

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isOnboarded).toBe(false);
  });

  it('should set loading state', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
