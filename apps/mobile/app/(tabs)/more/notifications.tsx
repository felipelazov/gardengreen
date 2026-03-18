// apps/mobile/app/(tabs)/more/notifications.tsx
// Tela de configuracao de notificacoes push
// [Source: PRD EPIC-07, Story 7.3]

import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import {
  useNotificationPreferences,
  useUpdatePreferences,
} from '@/hooks/useNotificationPreferences';
import type { NotificationPreference } from '@shared/types/database';

// ============================================
// Opcoes de horario
// ============================================

const MORNING_TIMES = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00'];
const EVENING_TIMES = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const PAYMENT_DAYS_OPTIONS = [1, 3, 5, 7];

// ============================================
// Sub-componentes
// ============================================

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
      }}
    >
      {title}
    </Text>
  );
}

interface ToggleRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

function ToggleRow({ label, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{label}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#16A34A' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

interface TimePickerProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (time: string) => void;
}

function TimePicker({ label, value, options, onSelect }: TimePickerProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 10 }}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((time) => {
          const selected = time === value;
          return (
            <TouchableOpacity
              key={time}
              onPress={() => onSelect(time)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                backgroundColor: selected ? '#16A34A' : '#F3F4F6',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: selected ? '600' : '400',
                  color: selected ? '#FFFFFF' : '#374151',
                }}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface DaysSelectorProps {
  value: number;
  onSelect: (days: number) => void;
}

function DaysSelector({ value, onSelect }: DaysSelectorProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 10 }}>
        Lembrar com quantos dias de antecedencia
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {PAYMENT_DAYS_OPTIONS.map((days) => {
          const selected = days === value;
          return (
            <TouchableOpacity
              key={days}
              onPress={() => onSelect(days)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: selected ? '#16A34A' : '#F3F4F6',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: selected ? '700' : '400',
                  color: selected ? '#FFFFFF' : '#374151',
                }}
              >
                {days}d
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ============================================
// Tela principal
// ============================================

export default function NotificationsScreen() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const { preferences, loading } = useNotificationPreferences(userId);
  const { updatePreferences, saveError } = useUpdatePreferences(userId);

  // Estado local para UI responsiva (sem esperar o banco confirmar)
  const [localPrefs, setLocalPrefs] = useState<Partial<NotificationPreference>>({});

  const getValue = useCallback(
    <K extends keyof NotificationPreference>(key: K): NotificationPreference[K] | undefined => {
      if (key in localPrefs) return localPrefs[key] as NotificationPreference[K];
      return preferences?.[key];
    },
    [localPrefs, preferences],
  );

  async function handleUpdate(updates: Partial<NotificationPreference>) {
    // Atualizar UI imediatamente
    setLocalPrefs((prev) => ({ ...prev, ...updates }));
    // Persistir no banco
    await updatePreferences(updates);
    if (saveError) {
      Alert.alert('Erro', 'Nao foi possivel salvar a configuracao. Tente novamente.');
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  const morningEnabled = getValue('morning_enabled') ?? true;
  const morningTime = getValue('morning_time') ?? '05:30';
  const eveningEnabled = getValue('evening_enabled') ?? true;
  const eveningTime = getValue('evening_time') ?? '19:30';
  const paymentEnabled = getValue('payment_reminder_enabled') ?? true;
  const paymentDays = getValue('payment_reminder_days') ?? 3;
  const monthlyEnabled = getValue('monthly_report_enabled') ?? true;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: '#F0FDF4',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={{ fontSize: 22, color: '#16A34A' }}>‹</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#14532D', marginLeft: 8 }}>
          Notificacoes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Push matinal */}
        <SectionHeader title="Push Matinal" />
        <View style={{ borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 }}>
          <ToggleRow
            label="Push matinal"
            subtitle="Receba seus clientes do dia antes de sair"
            value={morningEnabled}
            onValueChange={(val) => handleUpdate({ morning_enabled: val })}
          />
          {morningEnabled ? (
            <TimePicker
              label="Horario de envio"
              value={morningTime}
              options={MORNING_TIMES}
              onSelect={(time) => handleUpdate({ morning_time: time })}
            />
          ) : null}
        </View>

        {/* Push vespera */}
        <SectionHeader title="Push de Vespera" />
        <View style={{ borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 }}>
          <ToggleRow
            label="Push de vespera"
            subtitle="Veja seus clientes de amanha no final do dia"
            value={eveningEnabled}
            onValueChange={(val) => handleUpdate({ evening_enabled: val })}
          />
          {eveningEnabled ? (
            <TimePicker
              label="Horario de envio"
              value={eveningTime}
              options={EVENING_TIMES}
              onSelect={(time) => handleUpdate({ evening_time: time })}
            />
          ) : null}
        </View>

        {/* Lembrete de cobranca */}
        <SectionHeader title="Lembrete de Cobranca" />
        <View style={{ borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 }}>
          <ToggleRow
            label="Lembrete de cobranca"
            subtitle="Aviso sobre pagamentos pendentes"
            value={paymentEnabled}
            onValueChange={(val) => handleUpdate({ payment_reminder_enabled: val })}
          />
          {paymentEnabled ? (
            <DaysSelector
              value={paymentDays}
              onSelect={(days) => handleUpdate({ payment_reminder_days: days })}
            />
          ) : null}
        </View>

        {/* Relatorio mensal */}
        <SectionHeader title="Relatorio Mensal" />
        <View style={{ borderRadius: 12, overflow: 'hidden', marginHorizontal: 16 }}>
          <ToggleRow
            label="Relatorio mensal"
            subtitle="Notificacao quando seu relatorio do mes ficar pronto"
            value={monthlyEnabled}
            onValueChange={(val) => handleUpdate({ monthly_report_enabled: val })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
