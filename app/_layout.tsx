import { Stack } from 'expo-router';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function RootLayout() {
  return (
    <AuthWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthWrapper>
  );
}
