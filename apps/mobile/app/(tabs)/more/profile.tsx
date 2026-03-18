import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@shared/lib/supabase';
import { calculateProfileCompletion } from '@shared/utils/calculateProfileCompletion';
import { useAuthStore } from '@/stores/authStore';

const SERVICE_TYPES = [
  'Jardinagem Geral',
  'Paisagismo',
  'Poda de Arvores',
  'Corte de Grama',
  'Irrigacao',
  'Controle de Pragas',
  'Plantio',
  'Manutencao de Jardim',
];

function applyCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface FieldStatus {
  filled: boolean;
}

function FieldIndicator({ filled }: FieldStatus) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: filled ? '#16A34A' : '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
      }}
    >
      {filled ? (
        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>✓</Text>
      ) : null}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [serviceType, setServiceType] = useState(user?.service_type ?? '');
  const [cnpjMei, setCnpjMei] = useState(user?.cnpj_mei ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const currentCompletion = user
    ? calculateProfileCompletion({
        ...user,
        name,
        phone: phone || null,
        email: email || null,
        city: city || null,
        service_type: serviceType || null,
        cnpj_mei: cnpjMei || null,
        address: address || null,
        avatar_url: avatarUrl || null,
      })
    : 0;

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissao necessaria', 'Permita o acesso a galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    if (!user) return;

    setUploadingAvatar(true);
    try {
      const ext = asset.uri.split('.').pop() ?? 'jpg';
      const fileName = `${user.id}/avatar.${ext}`;

      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, { upsert: true, contentType: `image/${ext}` });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
    } catch (err) {
      Alert.alert('Erro', 'Nao foi possivel fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Campo obrigatorio', 'O nome e obrigatorio.');
      return;
    }

    setSaving(true);
    try {
      const updatedFields = {
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        city: city || null,
        service_type: serviceType || null,
        cnpj_mei: cnpjMei || null,
        address: address || null,
        avatar_url: avatarUrl || null,
      };

      const newCompletion = calculateProfileCompletion({
        ...user,
        ...updatedFields,
      });

      const { data, error } = await supabase
        .from('users')
        .update({ ...updatedFields, profile_completion: newCompletion })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (err) {
      Alert.alert('Erro', 'Nao foi possivel salvar o perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8, marginRight: 8 }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 22, color: '#16A34A' }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#14532D', flex: 1 }}>
              Meu Perfil
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Completude do perfil</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#16A34A' }}>
                {currentCompletion}%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: '#DCFCE7',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${currentCompletion}%`,
                  backgroundColor: '#16A34A',
                  borderRadius: 4,
                }}
              />
            </View>
          </View>

          {/* Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.8}
              disabled={uploadingAvatar}
            >
              <View
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 48,
                  backgroundColor: '#D1FAE5',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                  />
                ) : (
                  <Text style={{ fontSize: 36 }}>👤</Text>
                )}
              </View>
              {/* Camera overlay */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: '#16A34A',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: '#F0FDF4',
                }}
              >
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ fontSize: 14 }}>📷</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Form fields */}
          <View style={{ paddingHorizontal: 16 }}>
            {/* Name */}
            <FieldRow
              label="Nome *"
              filled={!!name.trim()}
              input={
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                />
              }
            />

            {/* Phone */}
            <FieldRow
              label="Telefone"
              filled={!!phone}
              input={
                <TextInput
                  value={phone}
                  onChangeText={(v) => setPhone(applyPhoneMask(v))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  style={inputStyle}
                />
              }
            />

            {/* Email */}
            <FieldRow
              label="E-mail"
              filled={!!email}
              input={
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={inputStyle}
                />
              }
            />

            {/* City */}
            <FieldRow
              label="Cidade"
              filled={!!city}
              input={
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Sua cidade"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                />
              }
            />

            {/* Service type (dropdown) */}
            <FieldRow
              label="Tipo de Servico"
              filled={!!serviceType}
              input={
                <>
                  <TouchableOpacity
                    onPress={() => setShowServicePicker(!showServicePicker)}
                    activeOpacity={0.8}
                    style={[inputStyle, { justifyContent: 'center' }]}
                  >
                    <Text style={{ color: serviceType ? '#111827' : '#9CA3AF', fontSize: 15 }}>
                      {serviceType || 'Selecione o tipo de servico'}
                    </Text>
                  </TouchableOpacity>
                  {showServicePicker && (
                    <View
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        marginTop: 4,
                        overflow: 'hidden',
                      }}
                    >
                      {SERVICE_TYPES.map((type) => (
                        <TouchableOpacity
                          key={type}
                          onPress={() => {
                            setServiceType(type);
                            setShowServicePicker(false);
                          }}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F4F6',
                            backgroundColor: serviceType === type ? '#F0FDF4' : '#FFFFFF',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: serviceType === type ? '#16A34A' : '#374151',
                              fontWeight: serviceType === type ? '600' : '400',
                            }}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              }
            />

            {/* CNPJ/MEI */}
            <FieldRow
              label="CNPJ / MEI"
              filled={!!cnpjMei}
              input={
                <TextInput
                  value={cnpjMei}
                  onChangeText={(v) => setCnpjMei(applyCnpjMask(v))}
                  placeholder="00.000.000/0000-00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={inputStyle}
                />
              }
            />

            {/* Address */}
            <FieldRow
              label="Endereco"
              filled={!!address}
              input={
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Rua, numero, bairro"
                  placeholderTextColor="#9CA3AF"
                  style={inputStyle}
                />
              }
            />
          </View>

          {/* Save button */}
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
              style={{
                backgroundColor: saving ? '#86EFAC' : '#16A34A',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
              ) : null}
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                {saving ? 'Salvando...' : 'Salvar Perfil'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const inputStyle = {
  height: 48,
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingHorizontal: 14,
  fontSize: 15,
  color: '#111827',
  flex: 1,
};

function FieldRow({
  label,
  filled,
  input,
}: {
  label: string;
  filled: boolean;
  input: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', flex: 1 }}>{label}</Text>
        <FieldIndicator filled={filled} />
      </View>
      {input}
    </View>
  );
}
