import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal, FlatList, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useTransactions } from '../../hooks/use-transactions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useProfile } from '@/hooks/use-profile';
import { useClients } from '@/hooks/use-clients';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useExpenseCategories } from '@/hooks/use-expense-categories';

const gastoSchema = z.object({
  amount: z.string().min(1, 'Informe o valor'),
  entity_name: z.string().min(2, 'Quem ou onde você pagou?'),
  category_id: z.string().min(1, 'Selecione uma categoria'),
  payment_method: z.enum(['cash', 'pix', 'card']),
  date: z.date(),
  description: z.string().optional(),
});

interface GastoFormData {
  amount: string;
  entity_name: string;
  category_id: string;
  payment_method: 'cash' | 'pix' | 'card';
  date: Date;
  description?: string;
}

export default function NovoGasto() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const { showAlert } = useUIStore();
  const { user } = useAuthStore();
  const { profile } = useProfile();
  const { clients, loading: loadingClients, fetchClients } = useClients();
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const { categories, loading: loadingCategories } = useExpenseCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<GastoFormData>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      payment_method: 'pix',
      date: new Date(),
    }
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const onSubmit = async (data: GastoFormData) => {
    try {
      setLoading(true);
      const numericAmount = parseFloat(
        data.amount
          .replace(/[^\d,]/g, '')
          .replace(',', '.')
      );

      await addTransaction({
        type: 'expense',
        amount: numericAmount,
        title: selectedCategory?.name || 'Gasto',
        description: `Pago para: ${data.entity_name}${data.description ? ` - ${data.description}` : ''}`,
        payment_method: data.payment_method,
        category: selectedCategory?.name || 'Despesa',
        client_id: selectedClientId || undefined,
        date: data.date.toISOString(),
      });

      const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Guerreiro';

      showAlert({
        type: 'success',
        title: `Tudo certo, ${firstName}!`,
        message: 'Seu gasto foi registrado com sucesso.',
        onConfirm: () => router.back()
      });
    } catch {
      showAlert({
        type: 'error',
        title: 'Erro ao Salvar',
        message: 'Não foi possível salvar o gasto. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Hero Header */}
      <LinearGradient
        colors={['#E05555', '#E05555']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <ScreenHeader title="Novo Gasto" subtitle="Registre suas despesas" transparent />

        {/* Amount Card flutuante */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            VALOR DO GASTO
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <MaskInput
                value={value}
                onChangeText={onChange}
                mask={Masks.BRL_CURRENCY}
                style={{ fontSize: 44, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1 }}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
            )}
          />
          {errors.amount && (
            <Text style={{ color: '#FFFFFF', marginTop: 6, fontSize: 12, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
              {errors.amount.message}
            </Text>
          )}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20, marginTop: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View className="space-y-5">
            
            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUEM OU ONDE VOCÊ PAGOU?</Text>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="entity_name"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setSelectedClientId(null);
                        }}
                        placeholder="Ex: Posto, Mercado, João..."
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                        placeholderTextColor="#A0B0B5"
                      />
                    )}
                  />
                </View>
                <TouchableOpacity 
                  onPress={() => setShowClientModal(true)}
                  className="ml-3 bg-[#E05555]/10 p-4 rounded-[12px] shadow-sm justify-center items-center"
                  activeOpacity={0.7}
                  style={{ minWidth: 52, minHeight: 52 }}
                >
                  <Ionicons name="people" size={20} color="#E05555" />
                </TouchableOpacity>
              </View>
              {errors.entity_name && <Text className="text-[#E05555] mt-1.5 ml-1 text-xs font-bold">{errors.entity_name.message}</Text>}
            </View>

            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">COM O QUE VOCÊ GASTOU?</Text>
              <Controller
                control={control}
                name="category_id"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity 
                      onPress={() => setShowCategoryModal(true)}
                      activeOpacity={0.7}
                      className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
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
              />
              {errors.category_id && <Text className="text-[#E05555] mt-1.5 ml-1 text-xs font-bold">{errors.category_id.message}</Text>}
            </View>

            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUANDO FOI ISSO?</Text>
              <Controller
                control={control}
                name="date"
                render={({ field: { value, onChange } }) => (
                  <>
                    <TouchableOpacity 
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                      className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-[#E05555]/15 rounded-full items-center justify-center mr-3">
                          <Ionicons name="calendar" size={18} color="#E05555" />
                        </View>
                        <Text className="text-base font-bold text-text-primary">
                          {format(value, "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={value}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(Platform.OS === 'ios');
                          if (selectedDate) {
                            onChange(selectedDate);
                          }
                        }}
                        maximumDate={new Date()}
                      />
                    )}
                  </>
                )}
              />
            </View>

            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">COMO PAGOU?</Text>
              <Controller
                control={control}
                name="payment_method"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row justify-between gap-3">
                    {[
                      { id: 'pix', label: 'PIX', icon: 'flash', color: '#0D4F5C', bg: 'rgba(13, 79, 92, 0.08)' },
                      { id: 'cash', label: 'DINHEIRO', icon: 'cash', color: '#7BC67A', bg: 'rgba(123, 198, 122, 0.12)' },
                      { id: 'card', label: 'CARTÃO', icon: 'card', color: '#F0A500', bg: 'rgba(240, 165, 0, 0.1)' },
                    ].map((item) => {
                      const isSelected = value === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => onChange(item.id)}
                          activeOpacity={0.7}
                          className={`flex-1 p-4 rounded-[14px] items-center justify-center border ${
                            isSelected ? 'border-transparent' : 'bg-white border-border'
                          }`}
                          style={isSelected ? { backgroundColor: item.color, elevation: 2 } : {}}
                        >
                          <View 
                            className={`w-10 h-10 rounded-full items-center justify-center mb-2`}
                            style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : item.bg }}
                          >
                            <Ionicons 
                              name={item.icon as any} 
                              size={18} 
                              color={isSelected ? 'white' : item.color} 
                            />
                          </View>
                          <Text className={`text-[10px] font-black ${
                            isSelected ? 'text-white' : 'text-text-secondary'
                          }`}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>

            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">DETALHES (OPCIONAL)</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Adicione uma observação..."
                    multiline
                    numberOfLines={3}
                    className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary min-h-[100px] shadow-sm"
                    textAlignVertical="top"
                    placeholderTextColor="#A0B0B5"
                  />
                )}
              />
            </View>

          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.85}
            style={{ borderRadius: 999, overflow: 'hidden', marginTop: 24, marginBottom: 100, shadowColor: '#E05555', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 }}
            accessibilityLabel="Salvar gasto"
          >
            <LinearGradient
              colors={loading ? ['#C5D0D3', '#C5D0D3'] : ['#E05555', '#E05555']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ height: 58, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="receipt" size={22} color="white" />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }}>Salvar Gasto</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

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
                      setValue('category_id', item.id);
                      setShowCategoryModal(false);
                    }}
                    style={{ flex: 1 }}
                    className="bg-white p-4 rounded-[14px] mb-3 items-center shadow-sm"
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
                    onPress={() => { 
                      setValue('entity_name', '');
                      setSelectedClientId(null);
                      setShowClientModal(false); 
                      setClientSearch(''); 
                    }}
                    className="bg-surface p-4 rounded-[14px] mb-4 flex-row items-center shadow-sm"
                  >
                    <Ionicons name="person-remove-outline" size={22} color="#6B7F85" />
                    <Text className="text-text-secondary font-black text-base ml-3">Limpar seleção</Text>
                  </TouchableOpacity>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => { 
                      setValue('entity_name', item.name);
                      setSelectedClientId(item.id);
                      setShowClientModal(false);
                      setClientSearch('');
                    }}
                    className="bg-white p-4 rounded-[14px] mb-3 flex-row items-center shadow-sm"
                  >
                    <View className="w-10 h-10 bg-[#E05555]/10 rounded-full items-center justify-center mr-4">
                      <Text className="text-[#E05555] font-black text-base">{item.name[0]}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-primary font-bold text-base">{item.name}</Text>
                      {item.phone && <Text className="text-text-secondary font-semibold text-xs">{item.phone}</Text>}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
