import { router } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCreateClient } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';
import { applyPhoneMask } from '@shared/utils/formatPhone';
import { createClientSchema } from '@shared/schemas/clientSchema';

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, required, error, children }: FieldProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 6,
        }}
      >
        {label}
        {required && <Text style={{ color: '#DC2626' }}> *</Text>}
      </Text>
      {children}
      {error ? (
        <Text style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{error}</Text>
      ) : null}
    </View>
  );
}

const inputStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  color: '#111827',
  minHeight: 48,
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewClientScreen() {
  const user = useAuthStore((s) => s.user);
  const { createClient, loading } = useCreateClient();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhoneChange(value: string) {
    setForm((prev) => ({ ...prev, phone: applyPhoneMask(value) }));
  }

  async function handleSave() {
    // Zod validation
    const parsed = createClientSchema.safeParse({
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ''),
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      neighborhood: form.neighborhood.trim() || null,
      city: form.city.trim() || null,
      notes: form.notes.trim() || null,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof typeof form, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof form;
        if (key) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await createClient({
        userId: user!.id,
        ...parsed.data,
      });

      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar cliente.';
      Alert.alert('Erro', message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4 }}>
          <Text style={{ fontSize: 18, color: '#16A34A' }}>← Voltar</Text>
        </TouchableOpacity>
        <Text
          style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#14532D' }}
        >
          Novo Cliente
        </Text>
        <View style={{ width: 72 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Field label="Nome completo" required error={errors.name}>
            <TextInput
              value={form.name}
              onChangeText={update('name')}
              placeholder="Ex: Joao Silva"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.name ? { borderColor: '#DC2626' } : {}]}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </Field>

          <Field label="Telefone / WhatsApp" required error={errors.phone}>
            <TextInput
              value={form.phone}
              onChangeText={handlePhoneChange}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.phone ? { borderColor: '#DC2626' } : {}]}
              keyboardType="phone-pad"
              returnKeyType="next"
              maxLength={15}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <TextInput
              value={form.email}
              onChangeText={update('email')}
              placeholder="exemplo@email.com"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.email ? { borderColor: '#DC2626' } : {}]}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </Field>

          <Field label="Endereco" error={errors.address}>
            <TextInput
              value={form.address}
              onChangeText={update('address')}
              placeholder="Rua, numero"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.address ? { borderColor: '#DC2626' } : {}]}
              returnKeyType="next"
            />
          </Field>

          <Field label="Bairro" error={errors.neighborhood}>
            <TextInput
              value={form.neighborhood}
              onChangeText={update('neighborhood')}
              placeholder="Nome do bairro"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.neighborhood ? { borderColor: '#DC2626' } : {}]}
              returnKeyType="next"
            />
          </Field>

          <Field label="Cidade" error={errors.city}>
            <TextInput
              value={form.city}
              onChangeText={update('city')}
              placeholder="Nome da cidade"
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, errors.city ? { borderColor: '#DC2626' } : {}]}
              returnKeyType="next"
            />
          </Field>

          <Field label="Observacoes" error={errors.notes}>
            <TextInput
              value={form.notes}
              onChangeText={update('notes')}
              placeholder="Informacoes adicionais sobre o cliente..."
              placeholderTextColor="#9CA3AF"
              style={[inputStyle, { minHeight: 90, textAlignVertical: 'top' }, errors.notes ? { borderColor: '#DC2626' } : {}]}
              multiline
              returnKeyType="done"
              maxLength={500}
            />
            <Text style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 2 }}>
              {form.notes.length}/500
            </Text>
          </Field>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
            style={{
              backgroundColor: loading ? '#86EFAC' : '#16A34A',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                Salvar Cliente
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
