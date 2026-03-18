import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SERVICE_TYPES } from '@shared/constants/serviceTypes';
import type { CreateServiceInput } from '@shared/schemas/serviceSchema';
import { formatCurrency, parseCurrency } from '@shared/utils/formatCurrency';
import { RecurrenceConfig, type RecurrenceFrequency } from './RecurrenceConfig';

const PRIMARY = '#16A34A';

interface ClientOption {
  id: string;
  name: string;
}

export interface ServiceFormValues {
  serviceInput: CreateServiceInput;
  withRecurrence: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  recurrenceDayOfWeek: number;
}

interface ServiceFormProps {
  clients: ClientOption[];
  initialDate?: string;
  loading?: boolean;
  onSubmit: (values: ServiceFormValues) => void;
  onCancel?: () => void;
}

export function ServiceForm({
  clients,
  initialDate,
  loading,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [clientId, setClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientList, setShowClientList] = useState(false);
  const [date, setDate] = useState(initialDate ?? today);
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [valueDisplay, setValueDisplay] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [withRecurrence, setWithRecurrence] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceFrequency>('weekly');
  const [recurrenceDow, setRecurrenceDow] = useState(new Date().getDay());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()),
  );

  const selectedClient = clients.find((c) => c.id === clientId);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!clientId) newErrors.client = 'Selecione um cliente';
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) newErrors.date = 'Data invalida';
    if (!serviceType) newErrors.type = 'Selecione o tipo de servico';
    if (!valueDisplay) newErrors.value = 'Informe o valor';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const valueInCents = parseCurrency(valueDisplay);

    onSubmit({
      serviceInput: {
        client_id: clientId,
        date,
        time: time || null,
        type: serviceType,
        description: description || null,
        value: valueInCents,
        notes: notes || null,
      },
      withRecurrence,
      recurrenceFrequency: recurrenceFreq,
      recurrenceDayOfWeek: recurrenceDow,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Cliente */}
      <View style={styles.field}>
        <Text style={styles.label}>Cliente *</Text>
        <TouchableOpacity
          style={[styles.input, errors.client && styles.inputError]}
          onPress={() => setShowClientList(true)}
        >
          <Text style={selectedClient ? styles.inputText : styles.placeholder}>
            {selectedClient ? selectedClient.name : 'Selecionar cliente'}
          </Text>
        </TouchableOpacity>
        {errors.client && <Text style={styles.errorText}>{errors.client}</Text>}

        {showClientList && (
          <View style={styles.dropdown}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChangeText={setClientSearch}
              autoFocus
            />
            {filteredClients.slice(0, 8).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setClientId(c.id);
                  setShowClientList(false);
                  setClientSearch('');
                }}
              >
                <Text style={styles.dropdownItemText}>{c.name}</Text>
              </TouchableOpacity>
            ))}
            {filteredClients.length === 0 && (
              <Text style={styles.emptyDropdown}>Nenhum cliente encontrado</Text>
            )}
            <TouchableOpacity
              style={styles.dropdownClose}
              onPress={() => setShowClientList(false)}
            >
              <Text style={{ color: '#6B7280', fontSize: 13 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Data */}
      <View style={styles.field}>
        <Text style={styles.label}>Data *</Text>
        <TextInput
          style={[styles.input, errors.date && styles.inputError]}
          value={date}
          onChangeText={setDate}
          placeholder="AAAA-MM-DD"
          keyboardType="numeric"
          maxLength={10}
        />
        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
      </View>

      {/* Horario */}
      <View style={styles.field}>
        <Text style={styles.label}>Horario (opcional)</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="HH:MM"
          keyboardType="numeric"
          maxLength={5}
        />
      </View>

      {/* Tipo de servico */}
      <View style={styles.field}>
        <Text style={styles.label}>Tipo de servico *</Text>
        <View style={styles.chipRow}>
          {SERVICE_TYPES.map((st) => (
            <TouchableOpacity
              key={st.id}
              style={[
                styles.chip,
                serviceType === st.id && styles.chipActive,
              ]}
              onPress={() => setServiceType(st.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  serviceType === st.id && styles.chipTextActive,
                ]}
              >
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
      </View>

      {/* Valor */}
      <View style={styles.field}>
        <Text style={styles.label}>Valor (R$) *</Text>
        <TextInput
          style={[styles.input, errors.value && styles.inputError]}
          value={valueDisplay}
          onChangeText={setValueDisplay}
          placeholder="Ex: 150,00"
          keyboardType="decimal-pad"
        />
        {errors.value && <Text style={styles.errorText}>{errors.value}</Text>}
        {valueDisplay ? (
          <Text style={styles.hint}>
            {formatCurrency(parseCurrency(valueDisplay))}
          </Text>
        ) : null}
      </View>

      {/* Descricao */}
      <View style={styles.field}>
        <Text style={styles.label}>Descricao (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Detalhes do servico..."
          multiline
          numberOfLines={3}
          maxLength={500}
        />
      </View>

      {/* Observacoes */}
      <View style={styles.field}>
        <Text style={styles.label}>Observacoes (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Observacoes internas..."
          multiline
          numberOfLines={2}
          maxLength={500}
        />
      </View>

      {/* Repetir */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.label}>Repetir</Text>
          <Text style={styles.toggleSubtitle}>Criar servico recorrente</Text>
        </View>
        <Switch
          value={withRecurrence}
          onValueChange={setWithRecurrence}
          trackColor={{ false: '#D1D5DB', true: '#86EFAC' }}
          thumbColor={withRecurrence ? PRIMARY : '#9CA3AF'}
        />
      </View>

      {withRecurrence && (
        <View style={styles.recurrenceBox}>
          <RecurrenceConfig
            frequency={recurrenceFreq}
            dayOfWeek={recurrenceDow}
            onFrequencyChange={setRecurrenceFreq}
            onDayOfWeekChange={setRecurrenceDow}
          />
        </View>
      )}

      {/* Botoes */}
      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  field: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputText: {
    fontSize: 15,
    color: '#111827',
  },
  placeholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    color: '#16A34A',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#111827',
  },
  emptyDropdown: {
    padding: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  dropdownClose: {
    padding: 12,
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  recurrenceBox: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#86EFAC',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
