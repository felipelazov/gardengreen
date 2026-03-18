import { TouchableOpacity, View, Text } from 'react-native';

import type { QuoteModel } from '@/database/models/Quote';
import { formatCurrency } from '@shared/utils/formatCurrency';

interface QuoteCardProps {
  quote: QuoteModel;
  clientName: string;
  onPress: () => void;
}

export const QUOTE_STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  draft: { bg: '#F3F4F6', text: '#6B7280', label: 'Rascunho' },
  sent: { bg: '#DBEAFE', text: '#2563EB', label: 'Enviado' },
  approved: { bg: '#DCFCE7', text: '#15803D', label: 'Aprovado' },
  rejected: { bg: '#FEE2E2', text: '#DC2626', label: 'Recusado' },
  expired: { bg: '#FEF3C7', text: '#D97706', label: 'Expirado' },
};

function StatusBadge({ status }: { status: string }) {
  const config = QUOTE_STATUS_CONFIG[status] ?? QUOTE_STATUS_CONFIG['draft'];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '600', color: config.text }}>
        {config.label}
      </Text>
    </View>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function QuoteCard({ quote, clientName, onPress }: QuoteCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
      }}
    >
      {/* Linha superior: numero + data */}
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#14532D' }}>
          {quote.number}
        </Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
          {formatDate(quote.createdAt)}
        </Text>
      </View>

      {/* Nome do cliente */}
      <Text
        style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}
        numberOfLines={1}
      >
        {clientName}
      </Text>

      {/* Linha inferior: status + total */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusBadge status={quote.status} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#15803D' }}>
          {formatCurrency(quote.total)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
