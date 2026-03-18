import { Stack } from 'expo-router';

export default function AgendaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#16A34A',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Agenda', headerShown: true }}
      />
      <Stack.Screen
        name="week"
        options={{ title: 'Semana', headerShown: true }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'Novo Servico',
          presentation: 'modal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: 'Servico', headerShown: true }}
      />
    </Stack>
  );
}
