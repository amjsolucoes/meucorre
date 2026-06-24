import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, fallbackValue: T): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => resolve(fallbackValue), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  });
};

const getSecureItemWithTimeout = async (key: string): Promise<string | null> => {
  try {
    return await withTimeout(SecureStore.getItemAsync(key), 400, null);
  } catch (e) {
    return null;
  }
};

const LargeStorageAdapter = {
  getItem: async (key: string) => {
    try {
      // Tenta pegar do AsyncStorage com timeout de 1000ms
      const value = await withTimeout(AsyncStorage.getItem(key), 1000, null);
      if (value) return value;

      // Fallback para o SecureStore
      const legacyValue = await getSecureItemWithTimeout(key);
      if (legacyValue) {
        await withTimeout(AsyncStorage.setItem(key, legacyValue), 1000, undefined);
      }
      return legacyValue;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await withTimeout(AsyncStorage.setItem(key, value), 1000, undefined);
    } catch {
      // Ignore
    }
  },
  removeItem: async (key: string) => {
    try {
      await withTimeout(AsyncStorage.removeItem(key), 1000, undefined);
    } catch {
      // Ignore
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: LargeStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    // Evita múltiplas tentativas de refresh com token inválido
    storageKey: 'supabase.auth.token',
  },
});


