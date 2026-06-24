import { Stack, Redirect, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

export default function AuthLayout() {
  const { session, initialized } = useAuthStore();
  const segments = useSegments();

  if (!initialized) return null;

  // Se o usuário está no fluxo de recuperação de senha, não redirecionamos automaticamente
  const segmentsList = segments as string[];
  const isResettingPassword = segmentsList.includes('forgot-password') || segmentsList.includes('reset-password');

  if (session && !isResettingPassword) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
