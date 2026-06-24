import { useClients } from '@/hooks/use-clients';
import { useExpenseCategories } from '@/hooks/use-expense-categories';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../lib/supabase';

export default function CorreEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showAlert } = useUIStore();

  const { clients, loading: loadingClients } = useClients();
  const { categories, loading: loadingCategories } = useExpenseCategories();

  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'concluido' | 'pendente'>('concluido');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash' | 'card'>('pix');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            clients:client_id (id, name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setEditTitle(data.title);
        setEditAmount(Math.round(data.amount * 100).toString());
        setEditDescription(data.description || '');
        setEditStatus(data.status || 'concluido');
        setPaymentMethod(data.payment_method || 'pix');
        setTransactionType(data.type);
        setCategoryName(data.category || null);
        
        if (data.clients) {
          setSelectedClient(data.clients);
        } else {
          setSelectedClient(null);
        }

        if (data.date) {
          setDate(new Date(data.date + 'T12:00:00'));
        }
      } catch (error) {
        console.error('Error fetching transaction for edit:', error);
        showAlert({
          type: 'error',
          title: 'Erro',
          message: 'Não foi possível carregar os dados para edição.'
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      if (categoryName) {
        const found = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (found) setSelectedCategory(found);
      } else if (transactionType === 'expense' && editTitle) {
        // Fallback matching by name
        const found = categories.find(c => c.name.toLowerCase() === editTitle.toLowerCase());
        if (found) {
          setSelectedCategory(found);
        }
      }
    }
  }, [categories, categoryName, transactionType, editTitle]);

  const handleSaveTransaction = async () => {
    if (!editTitle.trim()) {
      showAlert({
        type: 'error',
        title: 'Título obrigatório',
        message: 'Por favor, insira um título para o corre.',
      });
      return;
    }

    const numericAmount = parseFloat(editAmount.replace(/[^\d]/g, '')) / 100;
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showAlert({
        type: 'error',
        title: 'Valor inválido',
        message: 'Por favor, insira um valor válido maior que zero.',
      });
      return;
    }

    if (transactionType === 'expense' && !selectedCategory) {
      showAlert({
        type: 'error',
        title: 'Categoria obrigatória',
        message: 'Por favor, selecione uma categoria para a despesa.',
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('transactions')
        .update({
          title: transactionType === 'expense' ? (selectedCategory?.name || editTitle.trim()) : editTitle.trim(),
          amount: numericAmount,
          description: editDescription.trim(),
          status: transactionType === 'income' ? editStatus : 'concluido',
          payment_method: paymentMethod,
          client_id: selectedClient?.id || null,
          category: transactionType === 'expense' ? (selectedCategory?.name || 'Despesa') : null,
          date: format(date, 'yyyy-MM-dd'),
        })
        .eq('id', id);

      if (error) throw error;

      showAlert({
        type: 'success',
        title: 'Sucesso',
        message: 'As alterações foram salvas com sucesso!',
      });

      router.back();
    } catch (error) {
      console.error('Error saving transaction:', error);
      showAlert({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar as alterações.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0D4F5C" />
      </View>
    );
  }

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
        <View className="ml-2 flex-1">
          <Text className="text-xl font-bold text-gray-900">Editar Corre</Text>
          <View className="flex-row items-center mt-0.5">
            <View 
              className="w-2 h-2 rounded-full mr-1.5" 
              style={{ backgroundColor: transactionType === 'income' ? '#7BC67A' : '#E05555' }}
            />
            <Text className="text-[10px] font-black text-text-secondary uppercase tracking-[1px]">
              {transactionType === 'income' ? 'Editando Ganho (Serviço)' : 'Editando Gasto (Despesa)'}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="pb-16">
            
            {/* Título do Corre */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Título do Corre</Text>
            <TextInput
              value={editTitle}
              onChangeText={(text) => setEditTitle(text.replace(/\n/g, ''))}
              className="bg-surface p-4 rounded-[10px] border border-border text-base font-semibold text-text-primary shadow-sm mb-5"
              placeholder="Ex: Corte de cabelo, Diária"
              placeholderTextColor="#A0B0B5"
              multiline={false}
              blurOnSubmit
              returnKeyType="done"
            />

            {/* Valor */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Valor</Text>
            <MaskInput
              value={editAmount}
              onChangeText={setEditAmount}
              mask={Masks.BRL_CURRENCY}
              keyboardType="numeric"
              className="bg-surface p-4 rounded-[10px] border border-border text-base font-semibold text-text-primary shadow-sm mb-5"
              placeholder="R$ 0,00"
              placeholderTextColor="#A0B0B5"
            />

            {/* Categoria da Despesa (Apenas para Gastos/Expenses) */}
            {transactionType === 'expense' && (
              <>
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Categoria da Despesa</Text>
                <TouchableOpacity 
                  onPress={() => setShowCategoryModal(true)}
                  activeOpacity={0.7}
                  className="bg-surface p-4 rounded-[10px] border border-border flex-row items-center justify-between shadow-sm mb-5"
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: selectedCategory?.color ? `${selectedCategory.color}15` : 'rgba(13, 79, 92, 0.08)' }}
                    >
                      <Ionicons 
                        name={selectedCategory?.icon || 'grid-outline'} 
                        size={18} 
                        color={selectedCategory?.color || '#0D4F5C'} 
                      />
                    </View>
                    <Text className={`text-base font-bold ${selectedCategory ? 'text-text-primary' : 'text-text-hint'}`}>
                      {selectedCategory?.name || 'Selecione a categoria'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
                </TouchableOpacity>
              </>
            )}

            {/* Data do Corre */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Data do Corre</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="bg-surface p-4 rounded-[10px] border border-border flex-row items-center justify-between shadow-sm mb-5"
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#0D4F5C" className="mr-2" />
                <Text className="text-base font-semibold text-text-primary ml-2">
                  {format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Text>
              </View>
              <Ionicons name="calendar" size={18} color="#0D4F5C" />
            </TouchableOpacity>

            {/* Cliente / Local */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Cliente / Local</Text>
            <TouchableOpacity 
              onPress={() => setShowClientModal(true)}
              className="bg-surface p-4 rounded-[10px] border border-border flex-row items-center justify-between shadow-sm mb-5"
            >
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={18} color="#0D4F5C" className="mr-2" />
                <Text className={`text-base font-semibold ml-2 ${selectedClient ? 'text-text-primary' : 'text-text-hint'}`}>
                  {selectedClient ? selectedClient.name : 'Nenhum cliente selecionado'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#0D4F5C" />
            </TouchableOpacity>

            {/* Forma de Pagamento */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Forma de Pagamento</Text>
            <View className="flex-row justify-between gap-3 mb-5">
              {[
                { id: 'pix', label: 'PIX', icon: 'flash', color: '#0D4F5C', bg: 'rgba(13, 79, 92, 0.08)' },
                { id: 'cash', label: 'DINHEIRO', icon: 'cash', color: '#7BC67A', bg: 'rgba(123, 198, 122, 0.12)' },
                { id: 'card', label: 'CARTÃO', icon: 'card', color: '#F0A500', bg: 'rgba(240, 165, 0, 0.1)' },
              ].map((item) => {
                const isSelected = paymentMethod === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setPaymentMethod(item.id as any)}
                    activeOpacity={0.7}
                    className={`flex-1 p-3.5 rounded-[14px] items-center justify-center border ${
                      isSelected ? 'border-transparent' : 'bg-surface border-border'
                    }`}
                    style={isSelected ? { backgroundColor: item.color, elevation: 2 } : {}}
                  >
                    <View 
                      className={`w-9 h-9 rounded-full items-center justify-center mb-1.5`}
                      style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : item.bg }}
                    >
                      <Ionicons 
                        name={item.icon as any} 
                        size={16} 
                        color={isSelected ? 'white' : item.color} 
                      />
                    </View>
                    <Text className={`text-[9px] font-black ${
                      isSelected ? 'text-white' : 'text-text-secondary'
                    }`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Status da Ação */}
            {transactionType === 'income' && (
              <>
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Status da Ação</Text>
                <View className="flex-row bg-surface p-1.5 rounded-[14px] shadow-sm mb-6">
                  <TouchableOpacity
                    onPress={() => setEditStatus('concluido')}
                    className={`flex-1 py-3.5 rounded-[10px] flex-row items-center justify-center ${
                      editStatus === 'concluido' ? 'bg-[#7BC67A]' : ''
                    }`}
                    accessibilityLabel="Marcar como concluído"
                    accessibilityRole="button"
                  >
                    <Ionicons name="checkmark-circle" size={18} color={editStatus === 'concluido' ? 'white' : '#6B7F85'} />
                    <Text className={`ml-2 text-xs font-black ${editStatus === 'concluido' ? 'text-white' : 'text-text-secondary'}`}>
                      CONCLUÍDO
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditStatus('pendente')}
                    className={`flex-1 py-3.5 rounded-[10px] flex-row items-center justify-center ${
                      editStatus === 'pendente' ? 'bg-[#F0A500]' : ''
                    }`}
                    accessibilityLabel="Marcar como pendente"
                    accessibilityRole="button"
                  >
                    <Ionicons name="time" size={18} color={editStatus === 'pendente' ? 'white' : '#6B7F85'} />
                    <Text className={`ml-2 text-xs font-black ${editStatus === 'pendente' ? 'text-white' : 'text-text-secondary'}`}>
                      PENDENTE
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Descrição */}
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Descrição</Text>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              className="bg-surface p-4 rounded-[10px] border border-border text-base font-semibold text-text-primary shadow-sm mb-8"
              placeholder="Ex: Detalhes adicionais do corre..."
              placeholderTextColor="#A0B0B5"
              multiline
              numberOfLines={4}
            />

            {/* Botoes Cancelar / Salvar matching agenda modal style */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="flex-1 bg-white p-4 rounded-full flex-row items-center justify-center shadow-sm border border-gray-100"
                style={{ minHeight: 52 }}
              >
                <Ionicons name="close-circle-outline" size={20} color="#E05555" />
                <Text className="text-[#E05555] font-black ml-1.5 uppercase text-xs tracking-wider">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveTransaction}
                disabled={isSaving}
                activeOpacity={0.8}
                className="flex-[1.5] bg-[#0D4F5C] p-4 rounded-full flex-row items-center justify-center shadow-md shadow-[#0D4F5C]/15"
                style={{ minHeight: 52 }}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text className="text-white font-black ml-1.5 uppercase text-xs tracking-wider">Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Client Picker Modal */}
      <Modal visible={showClientModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[20px] h-[75%] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">Selecionar Cliente</Text>
              <TouchableOpacity onPress={() => setShowClientModal(false)}>
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>
            
            <View className="mb-5">
              <View className="flex-row bg-surface rounded-[10px] items-center px-4 py-3 shadow-sm">
                <Ionicons name="search-outline" size={20} color="#6B7F85" />
                <TextInput
                  placeholder="Pesquisar cliente..."
                  value={clientSearch}
                  onChangeText={setClientSearch}
                  className="flex-1 ml-3 text-base font-semibold text-text-primary"
                  placeholderTextColor="#A0B0B5"
                />
                {clientSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setClientSearch('')}>
                    <Ionicons name="close-circle" size={20} color="#A0B0B5" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {loadingClients ? (
              <ActivityIndicator className="mt-10" color="#0D4F5C" />
            ) : (
              <FlatList
                data={clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <TouchableOpacity 
                    onPress={() => { setSelectedClient(null); setShowClientModal(false); setClientSearch(''); }}
                    className="bg-surface p-4 rounded-[14px] mb-4 flex-row items-center shadow-sm"
                  >
                    <Ionicons name="person-remove-outline" size={22} color="#6B7F85" />
                    <Text className="text-text-secondary font-black text-base ml-3">Nenhum cliente específico</Text>
                  </TouchableOpacity>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => { setSelectedClient(item); setShowClientModal(false); setClientSearch(''); }}
                    className="bg-white p-4 rounded-[14px] mb-3 flex-row items-center shadow-sm"
                  >
                    <View className="w-10 h-10 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-4">
                      <Text className="text-[#0D4F5C] font-black text-base">{item.name[0]}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-text-primary font-bold text-base mr-2">{item.name}</Text>
                        {item.is_whatsapp && (
                          <Ionicons name="logo-whatsapp" size={14} color="#7BC67A" />
                        )}
                      </View>
                      {item.phone && <Text className="text-text-secondary font-semibold text-xs">{item.phone}</Text>}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[20px] h-[75%] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">O que você comprou?</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            {loadingCategories ? (
              <ActivityIndicator className="mt-10" color="#0D4F5C" />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => { 
                      setSelectedCategory(item);
                      setCategoryName(item.name);
                      setEditTitle(item.name);
                      setShowCategoryModal(false);
                    }}
                    style={{ flex: 1 }}
                    className="bg-white p-4 rounded-[14px] mb-3 items-center shadow-sm border border-gray-100"
                  >
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mb-3"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Ionicons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <Text className="text-text-primary font-black text-center text-xs leading-tight">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* DatePicker Component */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}
