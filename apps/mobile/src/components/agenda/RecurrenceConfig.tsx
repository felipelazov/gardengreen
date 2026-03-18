import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const WEEKDAY_FULL = [
  'domingo',
  'segunda-feira',
  'terca-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sabado',
];

const FREQUENCY_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
];

interface RecurrenceConfigProps {
  frequency: RecurrenceFrequency;
  dayOfWeek: number;
  onFrequencyChange: (f: RecurrenceFrequency) => void;
  onDayOfWeekChange: (day: number) => void;
}

export function RecurrenceConfig({
  frequency,
  dayOfWeek,
  onFrequencyChange,
  onDayOfWeekChange,
}: RecurrenceConfigProps) {
  const previewText = buildPreview(frequency, dayOfWeek);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Frequencia</Text>
      <View style={styles.chipRow}>
        {FREQUENCY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              frequency === opt.value && styles.chipActive,
            ]}
            onPress={() => onFrequencyChange(opt.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                frequency === opt.value && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {frequency !== 'monthly' && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
            Dia da semana
          </Text>
          <View style={styles.chipRow}>
            {WEEKDAY_LABELS.map((label, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayChip,
                  dayOfWeek === idx && styles.chipActive,
                ]}
                onPress={() => onDayOfWeekChange(idx)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    dayOfWeek === idx && styles.chipTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.previewBox}>
        <Text style={styles.previewLabel}>Previa:</Text>
        <Text style={styles.previewText}>{previewText}</Text>
      </View>
    </View>
  );
}

function buildPreview(frequency: RecurrenceFrequency, dayOfWeek: number): string {
  const dayName = WEEKDAY_FULL[dayOfWeek] ?? 'segunda-feira';
  if (frequency === 'weekly') return `A cada ${dayName}`;
  if (frequency === 'biweekly') return `A cada duas semanas (${dayName})`;
  return 'Uma vez por mes';
}

const PRIMARY = '#16A34A';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewBox: {
    marginTop: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  previewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  previewText: {
    fontSize: 15,
    color: '#166534',
    fontWeight: '600',
  },
});
