import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { applyPhoneMask } from '@shared/utils/formatPhone';

interface PhoneInputProps {
  value: string;
  onChangeText: (raw: string, masked: string) => void;
  error?: string;
  placeholder?: string;
  testID?: string;
}

export function PhoneInput({
  value,
  onChangeText,
  error,
  placeholder = '(11) 99999-9999',
  testID,
}: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string) => {
    const masked = applyPhoneMask(text);
    const raw = masked.replace(/\D/g, '');
    onChangeText(raw, masked);
  };

  const borderColor = error
    ? '#DC2626'
    : isFocused
      ? '#16A34A'
      : '#D1D5DB';

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { borderColor }]}>
        <Text style={styles.prefix}>+55</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="phone-pad"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          maxLength={15}
          autoComplete="tel"
          textContentType="telephoneNumber"
          testID={testID}
          returnKeyType="done"
          accessibilityLabel="Campo de telefone"
          accessibilityHint="Digite seu numero com DDD"
        />
      </View>
      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  prefix: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#DC2626',
    paddingHorizontal: 4,
  },
});
