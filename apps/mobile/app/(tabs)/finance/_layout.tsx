import { Stack } from 'expo-router';

export default function FinanceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="pending"
        options={{
          headerShown: true,
          headerTitle: 'Pendentes',
          headerTintColor: '#16A34A',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontWeight: '700', color: '#111827' },
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="expenses"
        options={{
          headerShown: true,
          headerTitle: 'Despesas',
          headerTintColor: '#16A34A',
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { fontWeight: '700', color: '#111827' },
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="new-expense"
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="report/[id]"
        options={{
          headerShown: false,
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
