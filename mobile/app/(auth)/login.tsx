import { AMJBranding } from '@/components/amj-branding';
import { LogoIcon } from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    Dimensions,
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
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import { useUIStore } from '../../stores/ui';

const { height: SCREEN_H } = Dimensions.get('window');

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const showAlert = useUIStore((state) => state.showAlert);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Entry animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(40)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(logoAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(formAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(formOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      setSession(authData.session);
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Não consegui entrar',
        message: 'Verifique seu e-mail e senha e tente de novo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D4F5C' }} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      {/* Background gradient */}
      <LinearGradient
        colors={['#0D4F5C', '#1A6B7A', '#0D4F5C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Decorative blobs */}
      <View style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(123,198,122,0.12)' }} />
      <View style={{ position: 'absolute', bottom: 80, left: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,255,255,0.04)' }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingHorizontal: 24, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo area */}
          <Animated.View
            style={{
              alignItems: 'center',
              marginBottom: 0,
              opacity: logoAnim,
              transform: [{ scale: logoAnim }],
            }}
          >
            <LogoIcon size={180} color="#FFFFFF" />
          </Animated.View>

          {/* Form card */}
          <Animated.View
            style={{
              opacity: formOpacity,
              transform: [{ translateY: formAnim }],
            }}
          >
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
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 }}>
                Bem-vindo de volta!
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7F85', fontWeight: '500', marginBottom: 24 }}>
                Entre pra ver suas finanças
              </Text>

              {/* Email */}
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                  E-mail
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F5F7F8',
                        borderRadius: 14,
                        borderWidth: 1.5,
                        borderColor: errors.email ? '#E05555' : '#E2E8EA',
                        paddingHorizontal: 16,
                        height: 54,
                      }}
                    >
                      <Ionicons name="mail-outline" size={18} color="#A0B0B5" style={{ marginRight: 10 }} />
                      <TextInput
                        style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#1A1A1A' }}
                        placeholder="seu@email.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                        placeholderTextColor="#A0B0B5"
                        autoComplete="email"
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600', marginTop: 6, marginLeft: 4 }}>
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Senha */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Senha
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
                        autoComplete="password"
                      />
                      <TouchableOpacity onPress={() => setShowPass(!showPass)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
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

              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                style={{ alignSelf: 'flex-end', marginBottom: 24 }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 13, color: '#0D4F5C', fontWeight: '700' }}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>

              {/* CTA Button */}
              <TouchableOpacity
                onPress={handleSubmit(onLogin)}
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
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  {loading ? (
                    <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>
                      Entrando...
                    </Text>
                  ) : (
                    <>
                      <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>
                        Entrar no Corre
                      </Text>
                      <Ionicons name="arrow-forward" size={18} color="#7BC67A" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/signup')}
                style={{ paddingVertical: 16, alignItems: 'center' }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, color: '#6B7F85', fontWeight: '600' }}>
                  Não tem conta?{' '}
                  <Text style={{ color: '#0D4F5C', fontWeight: '800' }}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Brand attribution signature */}
          <AMJBranding variant="dark" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


