import { router } from 'expo-router';
import { Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/stores/authStore';

interface MenuItem {
  label: string;
  icon: string;
  onPress: () => void;
  subtitle?: string;
}

export default function MoreScreen() {
  const { user, signOut } = useAuthStore();

  const completion = user?.profile_completion ?? 0;

  function handleSignOut() {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Meu Perfil',
      icon: '👤',
      subtitle: `${completion}% completo`,
      onPress: () => router.push('/(tabs)/more/profile'),
    },
    {
      label: 'Configuracoes',
      icon: '⚙️',
      onPress: () => {},
    },
    {
      label: 'Minha Equipe',
      icon: '👥',
      subtitle: user?.plan === 'team' ? 'Plano Equipe ativo' : 'Upgrade disponivel',
      onPress: () => router.push('/(tabs)/more/team'),
    },
    {
      label: 'Sobre',
      icon: 'ℹ️',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0FDF4' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#14532D' }}>Mais</Text>
          {user?.name ? (
            <Text style={{ fontSize: 15, color: '#6B7280', marginTop: 4 }}>
              Olá, {user.name}
            </Text>
          ) : null}
        </View>

        {/* Menu items */}
        <View style={{ paddingHorizontal: 16 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 8,
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              }}
            >
              {/* Icon */}
              <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>

              {/* Label + subtitle */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                  {item.label}
                </Text>
                {item.subtitle ? (
                  <Text style={{ fontSize: 13, color: '#16A34A', marginTop: 2 }}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>

              {/* Chevron */}
              <Text style={{ fontSize: 18, color: '#9CA3AF' }}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 8, marginHorizontal: 4 }} />

          {/* Sign out */}
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            }}
          >
            <Text style={{ fontSize: 22, marginRight: 14 }}>🚪</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#DC2626' }}>Sair</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
