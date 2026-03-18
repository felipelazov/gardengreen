import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useInviteMember } from '@/hooks/useTeam';
import { useAuthStore } from '@/stores/authStore';

export default function InviteMemberScreen() {
  const { user } = useAuthStore();
  const teamId = user?.team_id ?? null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const { inviteMember, loading } = useInviteMember();

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleSendInvite() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatorio', 'Informe o nome do membro.');
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      Alert.alert('Telefone invalido', 'Informe um telefone valido com DDD.');
      return;
    }
    if (!teamId) {
      Alert.alert('Erro', 'Equipe nao encontrada. Tente novamente.');
      return;
    }

    try {
      await inviteMember(teamId, name.trim(), phone.trim());
      setSuccess(true);
    } catch (e) {
      Alert.alert('Erro ao convidar', 'Nao foi possivel enviar o convite. Tente novamente.');
    }
  }

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>✅</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#14532D', textAlign: 'center', marginBottom: 8 }}>
            Convite enviado!
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>
            O convite foi enviado para {name}. Assim que ele criar a conta, aparecera na sua equipe.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: '#16A34A',
              borderRadius: 12,
              paddingHorizontal: 28,
              paddingVertical: 14,
              width: '100%',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
              Voltar para Equipe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setName('');
              setPhone('');
              setSuccess(false);
            }}
            style={{ marginTop: 12, paddingVertical: 12 }}
          >
            <Text style={{ color: '#16A34A', fontSize: 15, fontWeight: '600' }}>
              Convidar outro membro
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Cabecalho */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
              <Text style={{ fontSize: 24, color: '#16A34A' }}>‹</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Convidar Membro</Text>
              <Text style={styles.subtitle}>O convite sera enviado por SMS</Text>
            </View>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Nome */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: Carlos Silva"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Telefone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Telefone (com DDD)</Text>
              <TextInput
                value={phone}
                onChangeText={(v) => setPhone(formatPhone(v))}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="phone-pad"
                returnKeyType="done"
                maxLength={15}
              />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                O membro recebera um link por SMS para criar sua conta e entrar na sua equipe. Ele vera apenas os servicos atribuidos a ele.
              </Text>
            </View>

            {/* Botao */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendInvite}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Enviar Convite</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#14532D',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  form: {
    paddingHorizontal: 20,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 52,
  },
  infoBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  infoText: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
