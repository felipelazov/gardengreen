import { Slot, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { supabase } from '@shared/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  const { isLoading, isAuthenticated, isOnboarded, setSession, setUser, setLoading, refreshUser } =
    useAuthStore();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        refreshUser().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await refreshUser();
        } else {
          setUser(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (!isOnboarded) {
      router.replace('/(auth)/onboarding/step1');
    } else {
      router.replace('/(tabs)/agenda');
    }
  }, [isLoading, isAuthenticated, isOnboarded]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0FDF4' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return <Slot />;
}
