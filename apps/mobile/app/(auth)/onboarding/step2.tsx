import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SERVICE_TYPES } from '@shared/constants/serviceTypes';

export default function OnboardingStep2() {
  const params = useLocalSearchParams<{ name?: string }>();
  const [city, setCity] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleContinuar = () => {
    router.push({
      pathname: '/(auth)/onboarding/step3',
      params: {
        name: params.name ?? '',
        city: city.trim(),
        serviceType: selectedService ?? '',
      },
    });
  };

  const handlePular = () => {
    router.push({
      pathname: '/(auth)/onboarding/step3',
      params: {
        name: params.name ?? '',
        city: '',
        serviceType: '',
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0FDF4' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1, paddingTop: 80, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24 }}>
          {/* Progress */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
            <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
            <View style={{ flex: 1, height: 4, backgroundColor: '#D1FAE5', borderRadius: 2 }} />
          </View>

          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#14532D', marginBottom: 8 }}>
            Onde voce trabalha?
          </Text>
          <Text style={{ fontSize: 16, color: '#166534', marginBottom: 24 }}>
            Nos ajude a personalizar o app para voce
          </Text>

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="Sua cidade"
            placeholderTextColor="#86EFAC"
            autoCapitalize="words"
            returnKeyType="done"
            style={{
              fontSize: 18,
              color: '#14532D',
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: city.length > 0 ? '#16A34A' : '#D1FAE5',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              minHeight: 56,
              marginBottom: 24,
            }}
          />

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#14532D', marginBottom: 12 }}>
            Principal servico que voce faz
          </Text>
        </View>

        {/* Service chips - scrollable */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 16,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {SERVICE_TYPES.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => setSelectedService(isSelected ? null : service.id)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: isSelected ? '#16A34A' : '#D1FAE5',
                  backgroundColor: isSelected ? '#16A34A' : '#fff',
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    color: isSelected ? '#fff' : '#166534',
                  }}
                >
                  {service.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
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
