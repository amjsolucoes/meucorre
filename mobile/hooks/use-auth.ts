import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';

// Limpa TODO o AsyncStorage de auth — não filtra por chave
const clearLocalStorageSilently = async () => {
  try {
    // Limpa todas as chaves — na dúvida, limpa tudo
    await AsyncStorage.clear();

    // Chaves conhecidas do SecureStore
    const secureKeys = [
      'supabase.auth.token',
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token',
    ];
    await Promise.all(
      secureKeys.map(k => SecureStore.deleteItemAsync(k).catch(() => { }))
    );
  } catch (e) {
    // silencioso
  }
};

let hasCleared = false; // flag de módulo — persiste entre re-renders

export function useAuth() {
  const { setSession, setInitialized } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        // Se houver erro de refresh token, limpa tudo e reseta
        if (error) {
          console.log('Erro ao restaurar sessão:', error.message);
          if (!hasCleared) {
            hasCleared = true;
            await clearLocalStorageSilently();
          }
          setSession(null);
          setInitialized(true);
          return;
        }

        // Se não houver sessão, apenas inicializa
        if (!session) {
          setSession(null);
          setInitialized(true);
          return;
        }

        // Sessão válida encontrada
        hasCleared = false;
        setSession(session);
        setInitialized(true);
      } catch (err) {
        // Captura qualquer erro não tratado
        console.log('Erro inesperado ao inicializar auth:', err);
        if (!hasCleared) {
          hasCleared = true;
          await clearLocalStorageSilently();
        }
        setSession(null);
        setInitialized(true);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (useAuthStore.getState().isProcessingPasswordReset) return;

        if (event === 'SIGNED_OUT' || (event as string) === 'TOKEN_REFRESH_FAILED') {
          if (!hasCleared) {
            hasCleared = true;
            await clearLocalStorageSilently();
          }
          setSession(null);
          setInitialized(true);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          hasCleared = false;
          setSession(session);
          setInitialized(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { initialized: useAuthStore(s => s.initialized) };
}