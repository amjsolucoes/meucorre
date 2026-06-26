import { AMJBranding } from '@/components/amj-branding';
import { LogoIcon } from '@/components/logo';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';
import { getFriendlyErrorMessage } from '../../lib/errors';
import { supabase } from '../../lib/supabase';

const signupSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});
type SignupData = z.infer<typeof signupSchema>;

const InputField = ({
  label, icon, error, children,
}: { label: string; icon: string; error?: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
      {label}
    </Text>
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: '#F5F7F8', borderRadius: 14, borderWidth: 1.5,
      borderColor: error ? '#E05555' : '#E2E8EA', paddingHorizontal: 16, height: 54,
    }}>
      <Ionicons name={icon as any} size={18} color="#A0B0B5" style={{ marginRight: 10 }} />
      {children}
    </View>
    {error && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 4 }}>{error}</Text>}
  </View>
);

export default function SignupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { showAlert } = useUIStore();

  const slideUp  = useRef(new Animated.Value(40)).current;
  const opacity  = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(slideUp, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSignUp = async (data: SignupData) => {
    if (!agreedToTerms) {
      showAlert({
        type: 'warning',
        title: 'Aceite os termos',
        message: 'Você precisa aceitar a Política de Uso e Privacidade para criar sua conta.',
      });
      return;
    }

    setLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (error) {
      showAlert({ type: 'error', title: 'Erro ao cadastrar', message: getFriendlyErrorMessage(error, 'Não foi possível criar sua conta.') });
      setLoading(false);
      return;
    }

    const firstName = data.name.split(' ')[0];
    if (authData.session) {
      showAlert({
        type: 'success',
        title: `Bem-vindo, ${firstName}! 🎉`,
        message: 'Conta criada. Vamos começar o corre?',
        onConfirm: () => router.replace('/(tabs)'),
      });
    } else {
      showAlert({
        type: 'info',
        title: 'Quase lá!',
        message: 'Verifique seu e-mail para confirmar e entrar.',
        onConfirm: () => router.replace('/(auth)/login'),
      });
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D4F5C' }} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#1A6B7A', '#0D4F5C', '#0A3D48']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Blobs decorativos */}
      <View style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(123,198,122,0.1)' }} />
      <View style={{ position: 'absolute', bottom: 60, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.04)' }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Conteúdo alinhado ao topo */}
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            {/* Logo */}
            <Animated.View style={{ alignItems: 'center', marginBottom: 0, transform: [{ scale: logoScale }], opacity: logoScale }}>
              <LogoIcon size={180} color="#FFFFFF" />
            </Animated.View>

            {/* Card */}
            <Animated.View style={{ opacity, transform: [{ translateY: slideUp }] }}>
            <View style={{
              backgroundColor: '#FFFFFF', borderRadius: 28, padding: 28,
              shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25, shadowRadius: 40, elevation: 30,
            }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 }}>
                Crie sua conta
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7F85', fontWeight: '500', marginBottom: 24 }}>
                Comece a organizar seu corre hoje!
              </Text>

              <InputField label="Seu Nome" icon="person-outline" error={errors.name?.message}>
                <Controller control={control} name="name" render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                    placeholder="Como quer ser chamado?"
                    value={value} onChangeText={onChange}
                    placeholderTextColor="#A0B0B5"
                    autoComplete="name"
                  />
                )} />
              </InputField>

              <InputField label="E-mail" icon="mail-outline" error={errors.email?.message}>
                <Controller control={control} name="email" render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                    placeholder="seu@email.com"
                    value={value} onChangeText={onChange}
                    autoCapitalize="none" keyboardType="email-address"
                    placeholderTextColor="#A0B0B5"
                    autoComplete="email"
                  />
                )} />
              </InputField>

              {/* Senha */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Senha
                </Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: '#F5F7F8', borderRadius: 14, borderWidth: 1.5,
                  borderColor: errors.password ? '#E05555' : '#E2E8EA', paddingHorizontal: 16, height: 54,
                }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#A0B0B5" style={{ marginRight: 10 }} />
                  <Controller control={control} name="password" render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                      placeholder="Crie uma senha forte"
                      secureTextEntry={!showPass}
                      value={value} onChangeText={onChange}
                      placeholderTextColor="#A0B0B5"
                    />
                  )} />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#A0B0B5" />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 4 }}>{errors.password.message}</Text>}
              </View>

              {/* Aceite de termos */}
              <TouchableOpacity
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 10 }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: agreedToTerms }}
                accessibilityLabel="Aceitar Política de Uso e Privacidade"
              >
                <View style={{
                  width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                  borderColor: agreedToTerms ? '#0D4F5C' : '#C5D0D3',
                  backgroundColor: agreedToTerms ? '#0D4F5C' : 'transparent',
                  alignItems: 'center', justifyContent: 'center',
                  marginTop: 1, flexShrink: 0,
                }}>
                  {agreedToTerms && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: '#6B7F85', fontWeight: '500', lineHeight: 20 }}>
                  Li e concordo com a{' '}
                  <Text
                    style={{ color: '#0D4F5C', fontWeight: '700', textDecorationLine: 'underline' }}
                    onPress={() => router.push('/politica-uso' as any)}
                  >
                    Política de Uso
                  </Text>
                  {' '}e a{' '}
                  <Text
                    style={{ color: '#0D4F5C', fontWeight: '700', textDecorationLine: 'underline' }}
                    onPress={() => router.push('/politica-privacidade' as any)}
                  >
                    Política de Privacidade
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Botão cadastrar */}
              <TouchableOpacity
                onPress={handleSubmit(onSignUp)}
                disabled={loading || !agreedToTerms}
                activeOpacity={0.85}
                style={{ borderRadius: 999, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={
                    loading || !agreedToTerms
                      ? ['#C5D0D3', '#C5D0D3']
                      : ['#0D4F5C', '#1A6B7A']
                  }
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ height: 54, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                >
                  <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>
                    {loading ? 'Criando conta...' : 'Criar minha conta'}
                  </Text>
                  {!loading && <Ionicons name="arrow-forward" size={18} color={agreedToTerms ? '#7BC67A' : 'rgba(255,255,255,0.4)'} />}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link para login */}
              <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                style={{ paddingVertical: 16, alignItems: 'center' }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, color: '#6B7F85', fontWeight: '600' }}>
                  Já tem conta?{' '}
                  <Text style={{ color: '#0D4F5C', fontWeight: '800' }}>Fazer login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          </View>{/* fim do flex center */}

          <AMJBranding variant="dark" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
