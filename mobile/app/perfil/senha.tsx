import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/screen-header';
import { useProfile } from '@/hooks/use-profile';
import { useUIStore } from '@/stores/ui';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: '', color: '', width: '0%' };
  
  let score = 0;
  
  // 1. Requisito básico de tamanho
  if (password.length >= 6) {
    score += 1;
  }
  if (password.length >= 8) {
    score += 1;
  }
  
  // 2. Complexidade de caracteres
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  if (hasUppercase || hasNumber || hasSpecial) {
    score += 1;
  }
  
  const finalScore = Math.min(score, 3);
  
  // Se tiver menos de 6 caracteres, é sempre Fraca
  if (password.length < 6) {
    return {
      score: 1,
      label: 'Senha muito curta (mínimo 6 caracteres)',
      color: '#E05555', // Vermelho
      width: '33%',
    };
  }
  
  if (finalScore === 1) {
    return {
      score: 1,
      label: 'Senha Fraca (tente misturar letras e números)',
      color: '#E05555', // Vermelho
      width: '33%',
    };
  } else if (finalScore === 2) {
    return {
      score: 2,
      label: 'Senha Razoável (adicione símbolos ou letras maiúsculas)',
      color: '#F0A500', // Laranja
      width: '66%',
    };
  } else {
    return {
      score: 3,
      label: 'Senha Forte! Excelente escolha.',
      color: '#7BC67A', // Verde
      width: '100%',
    };
  }
};

export default function AlterarSenhaScreen() {
  const { changePassword } = useProfile();
  const { showAlert } = useUIStore();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if (newPassword.length < 6) {
      showAlert({ type: 'error', title: 'Senha fraca', message: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert({ type: 'error', title: 'Senhas diferentes', message: 'As senhas não coincidem.' });
      return;
    }

    try {
      setLoading(true);
      await changePassword(newPassword);
      showAlert({ type: 'success', title: 'Senha alterada!', message: 'Sua senha foi atualizada com sucesso.' });
      router.back();
    } catch (e: any) {
      let friendlyMessage = e.message;
      if (e.message?.includes('different from the old password')) {
        friendlyMessage = 'A nova senha deve ser diferente da sua senha atual.';
      } else if (e.message?.includes('at least 6 characters')) {
        friendlyMessage = 'A senha deve conter pelo menos 6 caracteres.';
      } else if (e.message?.includes('Network request failed') || e.message?.includes('Failed to fetch')) {
        friendlyMessage = 'Não foi possível conectar ao servidor. Verifique sua internet.';
      }
      showAlert({ type: 'error', title: 'Erro ao alterar senha', message: friendlyMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Alterar Senha" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView className="flex-1 px-6 mt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="space-y-5 pb-20">
            {/* Info card */}
            <View className="bg-[#0D4F5C]/10 p-4 rounded-[14px] flex-row items-start mb-4">
              <View className="w-9 h-9 bg-[#0D4F5C]/15 rounded-full items-center justify-center mr-3 mt-0.5">
                <Ionicons name="shield-checkmark-outline" size={18} color="#0D4F5C" />
              </View>
              <View className="flex-1">
                <Text className="text-[#0D4F5C] font-black text-sm mb-0.5">Dica de segurança</Text>
                <Text className="text-text-secondary font-medium text-xs leading-5">
                  Use uma senha com pelo menos 6 caracteres, combinando letras e números.
                </Text>
              </View>
            </View>

            {/* Nova Senha */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Nova Senha</Text>
              <View className="bg-surface flex-row items-center px-4 rounded-[10px] border border-border h-13 shadow-sm">
                <Ionicons name="lock-closed-outline" size={18} color="#6B7F85" />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#A0B0B5"
                  secureTextEntry={!showNew}
                  className="flex-1 mx-2.5 text-base font-semibold text-text-primary h-full"
                  accessibilityLabel="Nova senha"
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)} accessibilityLabel={showNew ? 'Ocultar senha' : 'Mostrar senha'}>
                  <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6B7F85" />
                </TouchableOpacity>
              </View>

              {/* Indicador de Força de Senha */}
              {newPassword.length > 0 && (() => {
                const strength = getPasswordStrength(newPassword);
                return (
                  <View className="mt-2.5 px-1">
                    <View className="flex-row items-center justify-between mb-1.5">
                      <Text className="text-xs font-bold" style={{ color: strength.color }}>
                        {strength.label}
                      </Text>
                    </View>
                    <View className="h-1.5 bg-surface rounded-full overflow-hidden border border-border/20">
                      <View 
                        className="h-full rounded-full"
                        style={{ 
                          width: strength.width as any, 
                          backgroundColor: strength.color 
                        }} 
                      />
                    </View>
                  </View>
                );
              })()}
            </View>

            {/* Confirmar Senha */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Confirmar Senha</Text>
              <View className="bg-surface flex-row items-center px-4 rounded-[10px] border border-border h-13 shadow-sm">
                <Ionicons name="lock-closed-outline" size={18} color="#6B7F85" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#A0B0B5"
                  secureTextEntry={!showConfirm}
                  className="flex-1 mx-2.5 text-base font-semibold text-text-primary h-full"
                  accessibilityLabel="Confirmar nova senha"
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} accessibilityLabel={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6B7F85" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              onPress={handleChange}
              disabled={loading}
              activeOpacity={0.8}
              className="rounded-full mt-6 overflow-hidden shadow-lg shadow-[#0D4F5C]/20"
            >
              <LinearGradient
                colors={['#0D4F5C', '#1A6B7A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4.5 flex-row items-center justify-center"
                style={{ minHeight: 52 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="key-outline" size={22} color="white" />
                    <Text className="text-white font-black text-base ml-2 uppercase">Salvar Nova Senha</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
