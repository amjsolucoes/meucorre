import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/screen-header';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/lib/supabase';

export default function ExcluirContaScreen() {
  const { showAlert } = useUIStore();
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    showAlert({
      type: 'error',
      title: 'Excluir Conta?',
      message: 'Todos os seus dados serão apagados permanentemente. Esta ação não pode ser desfeita.',
      showCancel: true,
      confirmText: 'SIM, EXCLUIR TUDO',
      cancelText: 'NÃO, VOLTAR',
      onConfirm: async () => {
        try {
          setLoading(true);
          // Delete user data from tables
          if (user) {
            await supabase.from('transactions').delete().eq('user_id', user.id);
            await supabase.from('appointments').delete().eq('user_id', user.id);
            await supabase.from('clients').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);
          }
          try {
            await supabase.auth.signOut();
          } catch (err) {
            console.error('Error signing out during account deletion:', err);
          }
          signOut();
        } catch (e: any) {
          showAlert({ type: 'error', title: 'Erro', message: e.message });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Excluir Conta" />

      <View className="flex-1 px-6 mt-8 items-center">
        {/* Warning Icon */}
        <View className="w-20 h-20 bg-[#E05555]/15 rounded-full items-center justify-center mb-5">
          <Ionicons name="warning" size={40} color="#E05555" />
        </View>

        <Text className="text-text-primary font-black text-2xl text-center mb-3">
          Ação Irreversível
        </Text>
        <Text className="text-text-secondary font-medium text-sm text-center leading-6 mb-8 px-2">
          Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo clientes, ganhos, gastos e agendamentos.
        </Text>

        {/* What will be deleted */}
        <View className="bg-surface w-full p-4.5 rounded-[14px] border border-border mb-8 shadow-sm">
          <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-4">O que será excluído</Text>
          {[
            { icon: 'people-outline', label: 'Todos os clientes' },
            { icon: 'cash-outline', label: 'Ganhos e gastos' },
            { icon: 'calendar-outline', label: 'Agendamentos' },
            { icon: 'person-outline', label: 'Seu perfil e dados pessoais' },
          ].map((item) => (
            <View key={item.label} className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-[#E05555]/15 rounded-full items-center justify-center mr-3">
                <Ionicons name={item.icon as any} size={15} color="#E05555" />
              </View>
              <Text className="text-text-secondary font-semibold text-sm">{item.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleDelete}
          disabled={loading}
          className="bg-[#E05555] w-full p-4.5 rounded-full items-center shadow-lg shadow-[#E05555]/20"
          accessibilityLabel="Excluir conta definitivamente"
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text className="text-white font-black text-sm uppercase tracking-wider">EXCLUIR MINHA CONTA</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
