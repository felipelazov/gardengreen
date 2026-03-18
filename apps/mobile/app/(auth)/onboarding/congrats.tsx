import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CongratsScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/agenda');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleIrParaAgenda = () => {
    router.replace('/(tabs)/agenda');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}
    >
      {/* Checkmark */}
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#16A34A',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <Text style={{ fontSize: 48 }}>✓</Text>
      </View>

      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#14532D',
          textAlign: 'center',
          marginBottom: 12,
        }}
      >
        Parabens!
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: '#166534',
          textAlign: 'center',
          marginBottom: 48,
          lineHeight: 26,
        }}
      >
        Seu app esta pronto. {'\n'}Vamos comecar!
      </Text>

      <TouchableOpacity
        onPress={handleIrParaAgenda}
        activeOpacity={0.8}
        style={{
          backgroundColor: '#16A34A',
          paddingVertical: 16,
          paddingHorizontal: 40,
          borderRadius: 12,
          minHeight: 56,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
          Ir para agenda
        </Text>
      </TouchableOpacity>
    </View>
  );
}
