import { Linking } from 'react-native';

export function generateQuoteMessage(params: {
  gardenerName: string;
  clientName: string;
  quoteNumber: string;
  items: { description: string; value: number; quantity: number }[];
  total: number;
  validUntil: string;
}): string {
  const itemLines = params.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.description} — R$ ${(item.value / 100).toFixed(2).replace('.', ',')} x${item.quantity}`,
    )
    .join('\n');

  // Formatar data de validade: "2026-04-01" → "01/04/2026"
  const [year, month, day] = params.validUntil.split('-');
  const validFormatted = `${day}/${month}/${year}`;

  return (
    `🌿 *Orcamento ${params.quoteNumber}*\n\n` +
    `Ola ${params.clientName}!\n\n` +
    `Segue o orcamento dos servicos:\n\n` +
    `${itemLines}\n\n` +
    `💰 *Total: R$ ${(params.total / 100).toFixed(2).replace('.', ',')}*\n\n` +
    `📅 Valido ate: ${validFormatted}\n\n` +
    `Qualquer duvida, estou a disposicao!\n` +
    `${params.gardenerName} 🌱`
  );
}

export function sendViaWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  Linking.openURL(url).catch(() => {
    // Fallback: abrir wa.me (funciona sem app instalado via browser)
    const webUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(webUrl);
  });
}
