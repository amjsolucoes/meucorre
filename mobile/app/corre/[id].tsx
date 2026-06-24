import { useExpenseCategories } from '@/hooks/use-expense-categories';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function CorreDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showAlert } = useUIStore();
  const { categories } = useExpenseCategories();

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          clients:client_id (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
      showAlert({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os dados do corre.'
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTransaction();
    }, [id])
  );

  const handleDelete = async () => {
    showAlert({
      type: 'error',
      title: 'Excluir Registro?',
      message: 'Tem certeza que deseja apagar este registro? Esta ação não pode ser desfeita.',
      showCancel: true,
      confirmText: 'SIM, EXCLUIR',
      cancelText: 'NÃO, VOLTAR',
      onConfirm: async () => {
        try {
          setIsDeleting(true);
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

          if (error) throw error;

          showAlert({
            type: 'success',
            title: 'Excluído!',
            message: 'O registro foi apagado com sucesso.'
          });
          
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Error deleting transaction:', error);
          showAlert({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível excluir o registro.'
          });
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0D4F5C" />
      </View>
    );
  }

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-2 -ml-2"
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={28} color="#0D4F5C" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-2">Detalhes do Corre</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="pb-12">
          
          {/* Main Title Section */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-text-secondary font-black text-[10px] uppercase tracking-[3px] mb-2">Registro de Corre</Text>
              <Text className="text-text-primary font-black text-2xl leading-tight">{transaction.title}</Text>
            </View>
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: isIncome ? 'rgba(123, 198, 122, 0.1)' : 'rgba(224, 85, 85, 0.1)' }}
            >
              <Text
                className="font-black text-[10px] uppercase tracking-widest"
                style={{ color: isIncome ? '#7BC67A' : '#E05555' }}
              >
                {isIncome ? 'Ganho' : 'Gasto'}
              </Text>
            </View>
          </View>

          {/* Premium Amount Box */}
          <View className="mb-8 rounded-[24px] overflow-hidden shadow-xl shadow-[#0D4F5C]/10">
            <LinearGradient
              colors={isIncome ? ['#0D4F5C', '#165F6E'] : ['#E05555', '#C53030']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-7 px-6 items-center relative"
            >
              {/* Subtle background circles for premium visual look */}
              <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5" />
              <View className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white/5" />

              <Text className="text-white/60 font-black text-[10px] uppercase tracking-[3px] mb-2">Valor Registrado</Text>
              <Text className="text-white font-black text-4xl">
                R$ {Number(transaction.amount).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              </Text>
            </LinearGradient>
          </View>

          {/* Premium Information Grid Card */}
          <View className="bg-surface rounded-[24px] p-6 shadow-md shadow-[#0D4F5C]/5 border border-gray-100 mb-8">
            
            {/* Date */}
            <View className="flex-row items-center border-b border-gray-200/30 pb-5 mb-5">
              <View className="w-11 h-11 bg-[#0D4F5C]/10 rounded-xl items-center justify-center mr-4">
                <Ionicons name="calendar-outline" size={20} color="#0D4F5C" />
              </View>
              <View>
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Data do Corre</Text>
                <Text className="text-text-primary font-black text-base mt-1">
                  {format(parseISO(transaction.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </Text>
              </View>
            </View>

            {/* Client / Location */}
            <View className="flex-row items-center border-b border-gray-200/30 pb-5 mb-5">
              <View className="w-11 h-11 bg-[#0D4F5C]/10 rounded-xl items-center justify-center mr-4">
                <Ionicons name="person-outline" size={20} color="#0D4F5C" />
              </View>
              <View>
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Cliente / Local</Text>
                <Text className="text-text-primary font-black text-base mt-1">
                  {transaction.clients?.name || transaction.description || 'Não informado'}
                </Text>
              </View>
            </View>

            {/* Categoria do Gasto (Apenas para Gastos/Despesas) */}
            {!isIncome && transaction.category && (() => {
              const matchedCategory = categories?.find(
                c => c.name.toLowerCase() === transaction.category.toLowerCase()
              );
              const catIcon = matchedCategory?.icon || 'grid-outline';
              const catColor = matchedCategory?.color || '#E05555';
              const catBg = matchedCategory?.color ? `${matchedCategory.color}15` : 'rgba(224, 85, 85, 0.1)';

              return (
                <View className="flex-row items-center border-b border-gray-200/30 pb-5 mb-5">
                  <View 
                    className="w-11 h-11 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: catBg }}
                  >
                    <Ionicons name={catIcon as any} size={20} color={catColor} />
                  </View>
                  <View>
                    <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Categoria da Despesa</Text>
                    <Text className="text-text-primary font-black text-base mt-1">
                      {transaction.category}
                    </Text>
                  </View>
                </View>
              );
            })()}

            {/* Status of Action (Only for Ganhos / Income) */}
            {isIncome && (
              <View className="flex-row items-center border-b border-gray-200/30 pb-5 mb-5">
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: transaction.status === 'pendente' ? 'rgba(240, 165, 0, 0.1)' : 'rgba(123, 198, 122, 0.1)' }}
                >
                  <Ionicons
                    name={transaction.status === 'pendente' ? 'time-outline' : 'checkmark-circle-outline'}
                    size={20}
                    color={transaction.status === 'pendente' ? '#F0A500' : '#7BC67A'}
                  />
                </View>
                <View>
                  <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Status da Ação</Text>
                  <Text
                    className="font-black text-base mt-1 uppercase"
                    style={{ color: transaction.status === 'pendente' ? '#F0A500' : '#7BC67A' }}
                  >
                    {transaction.status || 'Concluído'}
                  </Text>
                </View>
              </View>
            )}

            {/* Payment Method */}
            <View className={`flex-row items-center ${transaction.description && transaction.clients?.name ? 'border-b border-gray-200/30 pb-5 mb-5' : ''}`}>
              <View className="w-11 h-11 bg-[#0D4F5C]/10 rounded-xl items-center justify-center mr-4">
                <Ionicons name="card-outline" size={20} color="#0D4F5C" />
              </View>
              <View>
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Forma de Pagamento</Text>
                <Text className="text-text-primary font-black text-base mt-1 uppercase">
                  {transaction.payment_method === 'cash' ? 'Dinheiro'
                    : transaction.payment_method === 'card' ? 'Cartão'
                    : transaction.payment_method === 'pix' ? 'PIX'
                    : 'Dinheiro'}
                </Text>
              </View>
            </View>

            {/* Observation Description */}
            {transaction.description && transaction.clients?.name && (
              <View className="flex-row items-center pt-1">
                <View className="w-11 h-11 bg-[#0D4F5C]/10 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="document-text-outline" size={20} color="#0D4F5C" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-[2px]">Observação</Text>
                  <Text className="text-text-primary font-medium text-sm mt-1.5 leading-5">
                    {transaction.description}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Premium Modern Buttons matching agenda details modal style */}
          <View className="flex-row gap-3 mb-3">
            <TouchableOpacity
              onPress={() => router.push(`/corre/editar/${transaction.id}`)}
              activeOpacity={0.8}
              className="flex-1 bg-white p-4 rounded-full flex-row items-center justify-center shadow-sm border border-gray-100"
              style={{ minHeight: 52 }}
            >
              <Ionicons name="create-outline" size={20} color="#0D4F5C" />
              <Text className="text-[#0D4F5C] font-black ml-1.5 uppercase text-xs tracking-wider">Editar</Text>
            </TouchableOpacity>

            {isIncome && (
              <TouchableOpacity
                onPress={() => router.push(`/recibo/${transaction.id}` as any)}
                activeOpacity={0.85}
                className="flex-1 bg-[#0D4F5C] p-4 rounded-full flex-row items-center justify-center shadow-md shadow-[#0D4F5C]/15"
                style={{ minHeight: 52 }}
              >
                <Ionicons name="receipt-outline" size={20} color="white" />
                <Text className="text-white font-black ml-1.5 uppercase text-xs tracking-wider">Recibo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Premium Modern Delete Button matching agenda details modal */}
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
            className="bg-surface p-4 rounded-full flex-row items-center justify-center shadow-sm"
            style={{ minHeight: 52 }}
          >
            <Ionicons name="trash-outline" size={20} color="#6B7F85" />
            <Text className="text-text-secondary font-black ml-1.5 uppercase text-xs tracking-wider">
              {isDeleting ? 'Excluindo...' : 'Excluir Registro'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
