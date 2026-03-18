import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@shared/lib/supabase';
import { formatPhoneDisplay } from '@shared/schemas/phoneSchema';
import { useAuthStore } from '@/stores/authStore';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 5 * 60;

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const refreshUser = useAuthStore((s) => s.refreshUser);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start resend countdown on mount
  useEffect(() => {
    startResendTimer();
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendSecondsLeft((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startLockout = () => {
    setIsLockedOut(true);
    setLockoutSecondsLeft(LOCKOUT_SECONDS);
    if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
    lockoutTimerRef.current = setInterval(() => {
      setLockoutSecondsLeft((prev) => {
        if (prev <= 1) {
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
          setIsLockedOut(false);
          setAttempts(0);
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatSeconds = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) return `${m}:${String(s).padStart(2, '0')}`;
    return `${s}s`;
  };

  const handleDigitChange = (text: string, index: number) => {
    // Accept only one digit
    const digit = text.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (digit && newDigits.every((d) => d !== '')) {
      verifyOtp(newDigits.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (token: string) => {
    if (!phone || isVerifying || isLockedOut) return;

    setIsVerifying(true);
    setError('');

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (verifyError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          startLockout();
          setError(
            `Muitas tentativas incorretas. Tente novamente em ${formatSeconds(LOCKOUT_SECONDS)}.`
          );
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setError(
            `Codigo incorreto. ${remaining} tentativa${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.`
          );
        }

        // Clear the inputs on error
        setDigits(Array(OTP_LENGTH).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
        return;
      }

      // Success — _layout.tsx handles navigation via onAuthStateChange
      await refreshUser();
    } catch {
      setError('Nao foi possivel verificar o codigo. Tente novamente.');
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!phone || resendSecondsLeft > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({ phone });

      if (resendError) {
        setError('Nao foi possivel reenviar o SMS. Tente novamente.');
        return;
      }

      setDigits(Array(OTP_LENGTH).fill(''));
      setAttempts(0);
      startResendTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError('Nao foi possivel reenviar o SMS. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const isResendDisabled = resendSecondsLeft > 0 || isResending || isLockedOut;
  const displayPhone = phone ? formatPhoneDisplay(phone) : '';

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
            <Text style={styles.title}>Verifique seu numero</Text>
            <Text style={styles.subtitle}>
              Enviamos um codigo de 6 digitos para{'\n'}
              <Text style={styles.phoneHighlight}>{displayPhone}</Text>
            </Text>
          </View>

          {/* OTP inputs */}
          <View style={styles.otpContainer}>
            {digits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  error ? styles.otpInputError : null,
                  isLockedOut ? styles.otpInputLocked : null,
                ]}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isVerifying && !isLockedOut}
                testID={`otp-input-${index}`}
                accessibilityLabel={`Digito ${index + 1} do codigo`}
              />
            ))}
          </View>

          {/* Verifying indicator */}
          {isVerifying ? (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator color="#16A34A" size="small" />
              <Text style={styles.verifyingText}>Verificando...</Text>
            </View>
          ) : null}

          {/* Error message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText} accessibilityRole="alert">
                {error}
              </Text>
            </View>
          ) : null}

          {/* Lockout countdown */}
          {isLockedOut ? (
            <View style={styles.lockoutContainer}>
              <Text style={styles.lockoutText}>
                Aguarde {formatSeconds(lockoutSecondsLeft)} para tentar novamente.
              </Text>
            </View>
          ) : null}

          {/* Resend section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendPrompt}>Nao recebeu o codigo?</Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResendDisabled}
              accessibilityRole="button"
              accessibilityState={{ disabled: isResendDisabled }}
            >
              {isResending ? (
                <ActivityIndicator color="#16A34A" size="small" />
              ) : resendSecondsLeft > 0 ? (
                <Text style={styles.resendDisabledText}>
                  Reenviar em {formatSeconds(resendSecondsLeft)}
                </Text>
              ) : (
                <Text style={styles.resendActiveText}>Reenviar codigo</Text>
              )}
            </TouchableOpacity>
          </View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532D',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: '#16A34A',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
  },
  otpInputFilled: {
    borderColor: '#16A34A',
  },
  otpInputError: {
    borderColor: '#DC2626',
  },
  otpInputLocked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    color: '#9CA3AF',
  },
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  verifyingText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
  },
  lockoutContainer: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  lockoutText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
  resendSection: {
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendDisabledText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  resendActiveText: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
