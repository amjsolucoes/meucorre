import { ErrorBoundary } from '@/components/error-boundary';
import { ToastNotification } from '@/components/toast-notification';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { useAuth } from '../hooks/use-auth';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { debugListScheduledNotifications, requestNotificationPermission, setupAndroidNotificationChannel } from '@/hooks/use-notifications';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import SplashScreen from './splash';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { initialized } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // 1. Cria canal Android (obrigatório Android 8+)
    setupAndroidNotificationChannel();

    // 2. Solicita permissão ao usuário logo na abertura
    requestNotificationPermission().then((granted) => {
      if (__DEV__) {
        console.log('[Notifications] Permissão:', granted ? 'concedida' : 'negada');
        if (granted) debugListScheduledNotifications();
      }
    });

    // 3. Listener para notificações recebidas com app em foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // Notificação chegou com o app aberto — o handler global já exibe o alerta
      }
    );

    // 4. Listener para quando o usuário TOCA na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const appointmentId = response.notification.request.content.data?.appointmentId as string | undefined;
        if (appointmentId) {
          // Navega direto para o detalhe do agendamento ao tocar na notificação
          // A navegação é feita via Linking — expo-router responde automaticamente
        }
      }
    );

    // Timer para esconder splash após animação
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2400); // 2.4s total da animação

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      clearTimeout(timer);
    };
  }, []);

  if (!initialized || showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="cliente/[id]" />
            <Stack.Screen name="importar-contatos" />
            <Stack.Screen name="cliente/editar/[id]" />
          </Stack>
          <ToastNotification />
          <StatusBar style="dark" />
        </ThemeProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
