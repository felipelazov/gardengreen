import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@shared/lib/supabase';
import { formatPhoneToE164, phoneSchema } from '@shared/schemas/phoneSchema';
import { PhoneInput } from '@/components/ui/PhoneInput';

export default function PhoneScreen() {
  const [rawDigits, setRawDigits] = useState('');
  const [maskedValue, setMaskedValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handlePhoneChange = (raw: string, masked: string) => {
    setRawDigits(raw);
    setMaskedValue(masked);
    if (fieldError) setFieldError('');
    if (submitError) setSubmitError('');
  };

  const validatePhone = (): boolean => {
    const e164 = formatPhoneToE164(rawDigits);
    const result = phoneSchema.safeParse(e164);
    if (!result.success) {
      setFieldError(result.error.issues[0]?.message ?? 'Telefone invalido.');
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validatePhone()) return;

    const phone = formatPhoneToE164(rawDigits);
    setIsLoading(true);
    setSubmitError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });

      if (error) {
        setSubmitError('Nao foi possivel enviar SMS. Tente em alguns minutos.');
        return;
      }

      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone },
      });
    } catch {
      setSubmitError('Nao foi possivel enviar SMS. Tente em alguns minutos.');
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = rawDigits.length < 10 || isLoading;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Entrar com Telefone</Text>
            <Text style={styles.subtitle}>
              Vamos enviar um codigo SMS para verificar seu numero.
            </Text>
          </View>

          {/* Phone input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Seu numero de telefone</Text>
            <PhoneInput
              value={maskedValue}
              onChangeText={handlePhoneChange}
              error={fieldError}
              testID="phone-input"
            />
          </View>

          {/* Submit error */}
          {submitError ? (
            <View style={styles.submitErrorContainer}>
              <Text style={styles.submitErrorText} accessibilityRole="alert">
                {submitError}
              </Text>
            </View>
          ) : null}

          {/* Send button */}
          <TouchableOpacity
            onPress={handleSendCode}
            disabled={isButtonDisabled}
            activeOpacity={0.8}
            style={[
              styles.sendButton,
              isButtonDisabled && styles.sendButtonDisabled,
            ]}
            accessibilityLabel="Enviar codigo SMS"
            accessibilityRole="button"
            accessibilityState={{ disabled: isButtonDisabled }}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>Enviar codigo</Text>
            )}
          </TouchableOpacity>

          {/* Google login link */}
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={styles.googleLink}
            accessibilityRole="link"
          >
            <Text style={styles.googleLinkText}>
              Prefere entrar com Google?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 32,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#16A34A',
    fontWeight: '500',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  submitErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  submitErrorText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#86EFAC',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  googleLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  googleLinkText: {
    fontSize: 15,
    color: '#16A34A',
    textDecorationLine: 'underline',
  },
});
