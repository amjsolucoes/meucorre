import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';
import { getFriendlyErrorMessage } from '../../lib/errors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import { useUIStore } from '../../stores/ui';

import { LogoIcon } from '@/components/logo';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const authSession = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const url = Linking.useURL();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Cleanup de desmontagem da tela para garantir que a flag sempre volte para false
    return () => {
      useAuthStore.getState().setIsProcessingPasswordReset(false);
    };
  }, []);

  useEffect(() => {
    if (!url) return;
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleDeepLink = async () => {
      
      try {
        let code: string | null = null;

        // 1. Tenta extrair do hash fragment (#code=...) ou query parameter
        const hashMatch = url.match(/#(.*)/);
        if (hashMatch && hashMatch[1]) {
          const hashParams = new URLSearchParams(hashMatch[1]);
          code = hashParams.get('code');
        }

        // 2. Se não achou, tenta extrair dos query parameters (?code=...)
        if (!code) {
          const parsed = Linking.parse(url);
          code = (parsed.queryParams?.code as string) || null;
        }

        // 3. Se temos 'code', executa o fluxo PKCE (mais seguro)
        if (code) {
          useAuthStore.getState().setIsProcessingPasswordReset(true);
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('[ResetPassword] Erro ao trocar código por sessão:', error.message);
            useAuthStore.getState().setIsProcessingPasswordReset(false); // desativa se der erro
            showAlert({
              type: 'error',
              title: 'Código inválido',
              message: 'Não foi possível validar o código de recuperação. Por favor, solicite outro.',
            });
          } else if (data?.session) {
            useAuthStore.getState().setSession(data.session);
          }
        } else {
          
          // Verifica se já temos sessão ativa (por exemplo, vinda da verificação de OTP manual)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            useAuthStore.getState().setSession(session);
            useAuthStore.getState().setIsProcessingPasswordReset(true); // Ativa a flag de reset de senha para proteger contra loops de auth
          } else {
            showAlert({
              type: 'error',
              title: 'Link inválido',
              message: 'O link de recuperação está incompleto ou expirou. Solicite um novo link.',
            });
          }
        }
      } catch (err: any) {
        console.error('[ResetPassword] Erro ao processar deep link:', err.message);
      }
    };

    handleDeepLink();
  }, [url]);

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetPassword = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);

      let currentSession = authSession;
      if (!currentSession) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          useAuthStore.getState().setSession(session);
          currentSession = session;
        }
      }

      if (!currentSession) {
        throw new Error('Sessão ativa não encontrada. Por favor, solicite o código novamente.');
      }

      // Chama a API oficial do SDK do Supabase de forma assíncrona, capturando qualquer erro
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (updateError) {
        
        let errorMessage = updateError.message;
        if (errorMessage.toLowerCase().includes('different from the old password')) {
          errorMessage = 'A nova senha precisa ser diferente da senha que você já usava.';
        } else if (errorMessage.toLowerCase().includes('weak password')) {
          errorMessage = 'A senha escolhida é muito fraca. Tente misturar letras e números.';
        }
        throw new Error(errorMessage);
      }

      // Desativa a flag de reset de senha apenas depois de completar o updateUser com sucesso
      useAuthStore.getState().setIsProcessingPasswordReset(false);

      // 1. Limpa a sessão local e do Supabase de forma segura e não-bloqueante ANTES de redirecionar
      try {
        // Encerra a sessão com timeout defensivo de 1.5s para garantir que não trave em caso de deadlock
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500))
        ]).catch(() => {});
      } catch (e) {
        // Silencia
      }

      // 2. Reseta o estado do Zustand
      signOut();

      showAlert({
        type: 'success',
        title: 'Senha alterada!',
        message: 'Sua senha foi atualizada com sucesso. Agora você já pode entrar.',
      });
      
      // 3. Redireciona com total segurança, garantindo que não haverá processo assíncrono limpando a nova sessão
      router.replace('/login');
    } catch (error: any) {
      console.error('[ResetPassword] Erro ao salvar nova senha:', error);
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: getFriendlyErrorMessage(error, 'Não conseguimos atualizar sua senha. Tente novamente.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D4F5C' }} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0D4F5C', '#1A6B7A', '#0D4F5C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32, justifyContent: 'flex-start' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo + título */}
          <View style={{ alignItems: 'center', marginBottom: 0 }}>
            <LogoIcon size={180} color="#FFFFFF" />
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, textAlign: 'center', marginTop: 16 }}>
              Nova senha
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center' }}>
              Crie uma senha forte para proteger seu acesso.
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 28,
              padding: 28,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 40,
              elevation: 30,
            }}
          >
            {/* Password */}
            <View style={{ marginBottom: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Nova Senha
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F5F7F8',
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: errors.password ? '#E05555' : '#E2E8EA',
                      paddingHorizontal: 16,
                      height: 54,
                    }}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color="#A0B0B5" style={{ marginRight: 10 }} />
                    <TextInput
                      style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                      placeholder="••••••••"
                      secureTextEntry={!showPass}
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#A0B0B5"
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                      <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#A0B0B5" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 4 }}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                Confirmar Senha
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F5F7F8',
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: errors.confirmPassword ? '#E05555' : '#E2E8EA',
                      paddingHorizontal: 16,
                      height: 54,
                    }}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color="#A0B0B5" style={{ marginRight: 10 }} />
                    <TextInput
                      style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                      placeholder="••••••••"
                      secureTextEntry={!showPass}
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor="#A0B0B5"
                    />
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 4 }}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onResetPassword)}
              disabled={loading}
              activeOpacity={0.85}
              style={{ borderRadius: 999, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={loading ? ['#C5D0D3', '#C5D0D3'] : ['#0D4F5C', '#1A6B7A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 54,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
