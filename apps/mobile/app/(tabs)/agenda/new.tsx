import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView } from 'react-native';

import { ServiceForm, type ServiceFormValues } from '@/components/agenda/ServiceForm';
import { ClientModel } from '@/database/models/Client';
import { useCreateRecurrence } from '@/hooks/useRecurrences';
import { useCreateService } from '@/hooks/useServices';
import { useAuthStore } from '@/stores/authStore';

export default function NewServiceScreen() {
  const router = useRouter();
  const database = useDatabase();
  const { user } = useAuthStore();
  const userId = user?.id ?? '';
  const { date: paramDate } = useLocalSearchParams<{ date?: string }>();

  const { createService, loading: savingService } = useCreateService();
  const { createRecurrence, loading: savingRecurrence } = useCreateRecurrence();

  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      const results = await database
        .get<ClientModel>('clients')
        .query(Q.where('user_id', userId), Q.sortBy('name', Q.asc))
        .fetch();
      setClients(results.map((c) => ({ id: c.id, name: c.name })));
    };
    load();
  }, [database, userId]);

  const handleSubmit = async (values: ServiceFormValues) => {
    if (!userId) return;

    try {
      if (values.withRecurrence) {
        const startDate = values.serviceInput.date;
        await createRecurrence({
          userId,
          clientId: values.serviceInput.client_id,
          serviceType: values.serviceInput.type,
          value: values.serviceInput.value,
          frequency: values.recurrenceFrequency,
          dayOfWeek: values.recurrenceDayOfWeek,
          time: values.serviceInput.time,
          startDate,
          description: values.serviceInput.description,
          notes: values.serviceInput.notes,
        });
      } else {
        await createService(userId, values.serviceInput);
      }

      router.back();
    } catch (err) {
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel salvar o servico. Tente novamente.',
      );
      console.error('Error saving service:', err);
    }
  };

  const isLoading = savingService || savingRecurrence;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ServiceForm
        clients={clients}
        initialDate={paramDate}
        loading={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </SafeAreaView>
  );
}
