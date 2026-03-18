import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@shared/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        Alert.alert(
          'Erro no login',
          'Nao foi possivel entrar. Tente novamente.',
          [{ text: 'OK' }],
        );
      }
    } catch {
      Alert.alert(
        'Erro no login',
        'Nao foi possivel entrar. Tente novamente.',
        [{ text: 'OK' }],
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    router.push('/(auth)/phone');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}
    >
      {/* Logo */}
      <View style={{ marginBottom: 48 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#16A34A',
            textAlign: 'center',
          }}
        >
          GardenGreen
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#166534',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          O app do jardineiro brasileiro
        </Text>
      </View>

      {/* Google Login Button */}
      <TouchableOpacity
        onPress={handleGoogleLogin}
        disabled={isGoogleLoading}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#16A34A',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          width: '100%',
          minHeight: 56,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {isGoogleLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            Entrar com Google
          </Text>
        )}
      </TouchableOpacity>

      {/* Phone Login Button */}
      <TouchableOpacity
        onPress={handlePhoneLogin}
        activeOpacity={0.8}
        style={{
          backgroundColor: 'transparent',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#16A34A',
          width: '100%',
          minHeight: 56,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#16A34A', fontSize: 18, fontWeight: '600' }}>
          Entrar com Telefone
        </Text>
      </TouchableOpacity>
    </View>
  );
}
