import { Stack } from 'expo-router';

export default function QuotesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F0FDF4' },
      }}
    />
  );
}
