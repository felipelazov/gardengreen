import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthStore } from '@/stores/authStore';

export default function OnboardingStep1() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? '');

  const handleContinuar = () => {
    router.push({
      pathname: '/(auth)/onboarding/step2',
      params: { name: name.trim() },
    });
  };

  const handlePular = () => {
    router.push('/(auth)/onboarding/step2');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0FDF4' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 40,
          justifyContent: 'space-between',
        }}
      >
        {/* Header */}
        <View>
          {/* Progress */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
            <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 4, backgroundColor: '#D1FAE5', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 4, backgroundColor: '#D1FAE5', borderRadius: 2 }} />
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#14532D',
              marginBottom: 8,
            }}
          >
            Como seus clientes te chamam?
          </Text>
          <Text style={{ fontSize: 16, color: '#166534', marginBottom: 32 }}>
            Esse nome vai aparecer no app
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Seu nome ou apelido"
            placeholderTextColor="#86EFAC"
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinuar}
            style={{
              fontSize: 20,
              color: '#14532D',
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: name.length > 0 ? '#16A34A' : '#D1FAE5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 16,
              minHeight: 56,
            }}
          />
        </View>

        {/* Footer */}
        <View>
          <TouchableOpacity
            onPress={handleContinuar}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#16A34A',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              minHeight: 56,
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
              Continuar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePular} activeOpacity={0.7} style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: '#4ADE80', fontSize: 16 }}>Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
