import { Stack } from 'expo-router';

export default function ClientDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0FDF4' },
      }}
    />
  );
}
