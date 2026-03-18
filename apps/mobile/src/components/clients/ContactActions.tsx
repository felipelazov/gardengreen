import { Linking, TouchableOpacity, View, Text } from 'react-native';

// ─── Utility Functions ────────────────────────────────────────────────────────

export function callClient(phone: string) {
  const cleaned = phone.replace(/\D/g, '');
  Linking.openURL(`tel:+55${cleaned}`);
}

export function whatsappClient(phone: string, message?: string) {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  const url = `whatsapp://send?phone=${number}${message ? `&text=${encodeURIComponent(message)}` : ''}`;

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      // Fallback to web WhatsApp
      const webUrl = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
      Linking.openURL(webUrl);
    }
  });
}

// ─── ContactActions Component ─────────────────────────────────────────────────

interface ContactActionsProps {
  phone: string;
  clientName?: string;
  /** If true, shows buttons stacked vertically */
  vertical?: boolean;
}

export function ContactActions({ phone, clientName, vertical = false }: ContactActionsProps) {
  const defaultMessage = clientName
    ? `Ola, ${clientName}! Estou entrando em contato sobre o servico de jardinagem.`
    : undefined;

  return (
    <View
      style={{
        flexDirection: vertical ? 'column' : 'row',
        gap: 10,
      }}
    >
      {/* Call button */}
      <TouchableOpacity
        onPress={() => callClient(phone)}
        activeOpacity={0.75}
        style={{
          flex: vertical ? undefined : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#16A34A',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 18 }}>📞</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Ligar</Text>
      </TouchableOpacity>

      {/* WhatsApp button */}
      <TouchableOpacity
        onPress={() => whatsappClient(phone, defaultMessage)}
        activeOpacity={0.75}
        style={{
          flex: vertical ? undefined : 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#25D366',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        <Text style={{ fontSize: 18 }}>💬</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}
