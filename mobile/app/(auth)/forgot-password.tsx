import { LogoIcon } from '@/components/logo';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
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
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth';
import { useUIStore } from '../../stores/ui';

const emailSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

const otpSchema = z.object({
  code: z.string().length(6, 'O código deve ter 6 dígitos'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const showAlert = useUIStore((state) => state.showAlert);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  // Register 'code' field manually for React Hook Form
  useEffect(() => {
    otpForm.register('code');
  }, [otpForm]);

  // Focus first OTP input and reset local state when step changes
  useEffect(() => {
    if (step === 'otp') {
      setOtp(['', '', '', '', '', '']);
      otpForm.setValue('code', '');
      setTimeout(() => inputsRef.current[0]?.focus(), 500);
    }
  }, [step, otpForm]);

  const onSendEmail = async (data: EmailFormData) => {
    try {
      setLoading(true);
      const cleanEmail = data.email.trim().toLowerCase();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      
      if (error) throw error;

      setUserEmail(cleanEmail);
      setStep('otp');
      showAlert({
        type: 'success',
        title: 'Código enviado!',
        message: 'Verifique seu e-mail para encontrar o código de 6 dígitos.',
      });
    } catch {
      showAlert({
        type: 'error',
        title: 'Erro ao enviar',
        message: 'Não conseguimos enviar o código. Verifique o e-mail.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (data: OtpFormData) => {
    try {
      setLoading(true);
      const cleanCode = data.code.replace(/\s/g, '');
      const { data: resData, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: cleanCode,
        type: 'recovery',
      });
      
      if (error) throw error;

      // Sincroniza a sessão na store do Zustand de forma imediata antes de mudar de tela
      if (resData?.session) {
        useAuthStore.getState().setSession(resData.session);
      }

      router.push('/reset-password');
    } catch {
      showAlert({
        type: 'error',
        title: 'Código inválido',
        message: 'O código informado está incorreto ou expirou.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, '');

    if (cleanText.length >= 6) {
      // Se colou ou digitou múltiplos dígitos de uma vez (Autofill/Paste)
      const pastedCode = cleanText.slice(0, 6);
      const newOtp = pastedCode.split('').concat(Array(6).fill('')).slice(0, 6);
      setOtp(newOtp);
      otpForm.setValue('code', pastedCode, { shouldValidate: true });
      inputsRef.current[5]?.focus();
      return;
    }

    const newOtp = [...otp];
    // Pega apenas o último caractere digitado nesta célula
    newOtp[index] = cleanText.length > 0 ? cleanText.slice(-1) : '';
    setOtp(newOtp);

    const combined = newOtp.join('');
    otpForm.setValue('code', combined, { shouldValidate: true });

    // Avança automaticamente para o próximo campo caso um caractere tenha sido inserido
    if (newOtp[index] !== '' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      // Se o quadrado atual estiver vazio e o usuário apertar Backspace, voltamos apagando a célula anterior
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpForm.setValue('code', newOtp.join(''), { shouldValidate: true });
        inputsRef.current[index - 1]?.focus();
      }
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
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => step === 'otp' ? setStep('email') : router.back()}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.1)',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 24, alignSelf: 'flex-start',
            }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 0 }}>
            <LogoIcon size={180} color="#FFFFFF" />
          </View>

          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, textAlign: 'center' }}>
              {step === 'email' ? 'Recuperar acesso' : 'Confirmar código'}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center' }}>
              {step === 'email' 
                ? 'Informe o e-mail cadastrado para receber o código de acesso.'
                : `Enviamos um código de 6 dígitos para seu e-mail.`
              }
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
            {step === 'email' ? (
              <View>
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
                    E-mail de cadastro
                  </Text>
                  <Controller
                    control={emailForm.control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#F5F7F8',
                          borderRadius: 14,
                          borderWidth: 1.5,
                          borderColor: emailForm.formState.errors.email ? '#E05555' : '#E2E8EA',
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
                          value={value || ''}
                          onChangeText={onChange}
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                  {emailForm.formState.errors.email && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, marginLeft: 4, gap: 4 }}>
                      <Ionicons name="alert-circle" size={13} color="#E05555" />
                      <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600' }}>
                        {emailForm.formState.errors.email.message}
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={emailForm.handleSubmit(onSendEmail)}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={{ borderRadius: 999, overflow: 'hidden' }}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar código"
                  accessibilityState={{ disabled: loading, busy: loading }}
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
                      {loading ? 'Enviando...' : 'Enviar código'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6B7F85', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' }}>
                      Digite o código abaixo
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                      {Array(6).fill('').map((_, index) => {
                        const digit = otp[index] || '';
                        const isActive = activeInputIndex === index;

                        return (
                          <TextInput
                            key={index}
                            ref={(ref) => {
                              inputsRef.current[index] = ref;
                            }}
                            style={{
                              width: 44,
                              height: 56,
                              backgroundColor: '#F5F7F8',
                              borderRadius: 12,
                              borderWidth: 1.5,
                              borderColor: isActive
                                ? '#0D4F5C'
                                : otpForm.formState.errors.code
                                  ? '#E05555'
                                  : '#E2E8EA',
                              fontSize: 22,
                              fontWeight: '800',
                              color: '#0D4F5C',
                              textAlign: 'center',
                              // Sombra sutil de foco
                              shadowColor: isActive ? '#0D4F5C' : 'transparent',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: isActive ? 0.15 : 0,
                              shadowRadius: 4,
                              elevation: isActive ? 3 : 0,
                            }}
                            keyboardType="numeric"
                            value={digit}
                            onChangeText={(text) => handleChangeText(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => setActiveInputIndex(index)}
                            onBlur={() => {
                              if (activeInputIndex === index) {
                                setActiveInputIndex(null);
                              }
                            }}
                            selectTextOnFocus={true}
                          />
                        );
                      })}
                    </View>

                    {otpForm.formState.errors.code && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 4 }}>
                        <Ionicons name="alert-circle" size={13} color="#E05555" />
                        <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '600' }}>
                          {otpForm.formState.errors.code.message}
                        </Text>
                      </View>
                    )}
                  </View>

                <TouchableOpacity
                  onPress={otpForm.handleSubmit(onVerifyOtp)}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={{ borderRadius: 999, overflow: 'hidden', marginTop: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Verificar código"
                  accessibilityState={{ disabled: loading, busy: loading }}
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
                      {loading ? 'Verificando...' : 'Verificar código'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setStep('email');
                    otpForm.reset();
                  }}
                  style={{ marginTop: 24, alignItems: 'center' }}
                  accessibilityRole="button"
                  accessibilityLabel="Não recebeu o código? Enviar novamente"
                >
                  <Text style={{ fontSize: 13, color: '#6B7F85', fontWeight: '600' }}>
                    Não recebeu? <Text style={{ color: '#0D4F5C', fontWeight: '800' }}>Enviar novamente</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
