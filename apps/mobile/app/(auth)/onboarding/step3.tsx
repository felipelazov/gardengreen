import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@shared/lib/supabase';
import { database } from '@/database';
import { ClientModel } from '@/database/models/Client';
import { useAuthStore } from '@/stores/authStore';

function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function OnboardingStep3() {
  const params = useLocalSearchParams<{
    name?: string;
    city?: string;
    serviceType?: string;
  }>();

  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceDate, setServiceDate] = useState(formatDateDisplay(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) {
      setPhoneError('Telefone invalido. Use DDD + numero');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits, parens, dashes, spaces
    const cleaned = value.replace(/[^\d\s\-()]/g, '');
    setClientPhone(cleaned);
    if (phoneError) validatePhone(cleaned);
  };

  const handleConcluir = async () => {
    if (!clientName.trim()) {
      Alert.alert('Campo obrigatorio', 'Por favor, informe o nome do cliente.');
      return;
    }
    if (!validatePhone(clientPhone)) return;
    if (!user) {
      Alert.alert('Erro', 'Usuario nao encontrado. Tente novamente.');
      return;
    }

    setIsLoading(true);
    try {
      // Save profile updates (city, service_type, onboarding_completed)
      await supabase
        .from('users')
        .update({
          name: params.name || user.name,
          city: params.city || user.city,
          service_type: params.serviceType || user.service_type,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      // Save first client to WatermelonDB
      await database.write(async () => {
        await database.get<ClientModel>('clients').create((client) => {
          client.name = clientName.trim();
          client.phone = clientPhone.trim();
          client.email = null;
          client.address = null;
          client.neighborhood = null;
          client.city = params.city ?? null;
          client.notes = null;
          client.status = 'active';
          client.userId = user.id;
        });
      });

      // Refresh user so isOnboarded becomes true
      await refreshUser();

      router.replace('/(auth)/onboarding/congrats');
    } catch (error) {
      console.error('Onboarding step3 error:', error);
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel salvar os dados. Tente novamente.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePular = async () => {
    if (!user) {
      router.replace('/(auth)/onboarding/congrats');
      return;
    }
    setIsLoading(true);
    try {
      await supabase
        .from('users')
        .update({
          name: params.name || user.name,
          city: params.city || user.city,
          service_type: params.serviceType || user.service_type,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      await refreshUser();
      router.replace('/(auth)/onboarding/congrats');
    } catch {
      router.replace('/(auth)/onboarding/congrats');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F0FDF4' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
          <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
          <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
          <View style={{ flex: 1, height: 4, backgroundColor: '#16A34A', borderRadius: 2 }} />
        </View>

        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#14532D', marginBottom: 8 }}>
          Cadastre seu primeiro cliente
        </Text>
        <Text style={{ fontSize: 16, color: '#166534', marginBottom: 32 }}>
          Pode pular se preferir adicionar depois
        </Text>

        {/* Client Name */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#14532D', marginBottom: 8 }}>
          Nome do cliente
        </Text>
        <TextInput
          value={clientName}
          onChangeText={setClientName}
          placeholder="Ex: Jose Silva"
          placeholderTextColor="#86EFAC"
          autoCapitalize="words"
          returnKeyType="next"
          style={{
            fontSize: 18,
            color: '#14532D',
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: clientName.length > 0 ? '#16A34A' : '#D1FAE5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            minHeight: 56,
            marginBottom: 20,
          }}
        />

        {/* Client Phone */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#14532D', marginBottom: 8 }}>
          Telefone / WhatsApp
        </Text>
        <TextInput
          value={clientPhone}
          onChangeText={handlePhoneChange}
          placeholder="(11) 99999-9999"
          placeholderTextColor="#86EFAC"
          keyboardType="phone-pad"
          returnKeyType="next"
          maxLength={15}
          style={{
            fontSize: 18,
            color: '#14532D',
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: phoneError ? '#EF4444' : clientPhone.length > 0 ? '#16A34A' : '#D1FAE5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            minHeight: 56,
            marginBottom: phoneError ? 4 : 20,
          }}
        />
        {phoneError ? (
          <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 20 }}>{phoneError}</Text>
        ) : null}

        {/* Service Date */}
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#14532D', marginBottom: 8 }}>
          Data do primeiro servico
        </Text>
        <TextInput
          value={serviceDate}
          onChangeText={setServiceDate}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#86EFAC"
          keyboardType="numeric"
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleConcluir}
          style={{
            fontSize: 18,
            color: '#14532D',
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: serviceDate.length > 0 ? '#16A34A' : '#D1FAE5',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            minHeight: 56,
            marginBottom: 40,
          }}
        />

        {/* Footer */}
        <TouchableOpacity
          onPress={handleConcluir}
          disabled={isLoading}
          activeOpacity={0.8}
          style={{
            backgroundColor: '#16A34A',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            minHeight: 56,
            justifyContent: 'center',
            marginBottom: 16,
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
              Concluir
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePular}
          disabled={isLoading}
          activeOpacity={0.7}
          style={{ alignItems: 'center', paddingVertical: 12 }}
        >
          <Text style={{ color: '#4ADE80', fontSize: 16 }}>Pular</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
