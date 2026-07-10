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
import { PaymentMethodSelector } from '@/components/payment-method-selector';
import { SaveButton } from '@/components/save-button';
import { GroupedCard, GroupedRow, SectionLabel } from '@/components/ui/form-section';
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
      {/* Hero */}
      <LinearGradient
        colors={['#5C1A1E', '#93303A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <ScreenHeader title="Novo Gasto" subtitle="Registre suas despesas" transparent />

        <View style={{ paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Valor do gasto
          </Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <MaskInput
                value={value}
                onChangeText={onChange}
                mask={Masks.BRL_CURRENCY}
                style={{ fontSize: 44, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, fontVariant: ['tabular-nums'] }}
                placeholder="R$ 0,00"
                keyboardType="numeric"
                placeholderTextColor="rgba(255,255,255,0.35)"
              />
            )}
          />
          <View style={{ width: 56, height: 2, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: 12 }} />
          {errors.amount && (
            <Text style={{ color: '#FFFFFF', marginTop: 10, fontSize: 12, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 }}>
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
          style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View className="mb-6">
            <SectionLabel>Detalhes do gasto</SectionLabel>
            <GroupedCard>
              <View className="flex-row items-center px-4 py-3.5 border-b border-border">
                <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: 'rgba(147, 48, 58, 0.08)' }}>
                  <Ionicons name="storefront-outline" size={17} color="#93303A" />
                </View>
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
                      placeholder="Quem ou onde você pagou?"
                      className="flex-1 text-[15px] font-semibold text-text-primary"
                      placeholderTextColor="#A0B0B5"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowClientModal(true)}
                  accessibilityLabel="Selecionar cliente"
                  accessibilityRole="button"
                  className="ml-1 items-center justify-center"
                  style={{ width: 44, height: 44 }}
                >
                  <Ionicons name="people-outline" size={19} color="#93303A" />
                </TouchableOpacity>
              </View>

              <GroupedRow
                icon={selectedCategory?.icon || 'grid-outline'}
                iconColor={selectedCategory?.color || '#93303A'}
                iconBg={selectedCategory?.color ? `${selectedCategory.color}15` : 'rgba(147, 48, 58, 0.08)'}
                text={selectedCategory?.name || 'Selecione a categoria'}
                muted={!selectedCategory}
                onPress={() => setShowCategoryModal(true)}
              />

              <Controller
                control={control}
                name="date"
                render={({ field: { value } }) => (
                  <GroupedRow
                    icon="calendar"
                    iconColor="#93303A"
                    iconBg="rgba(147, 48, 58, 0.08)"
                    text={format(value, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    onPress={() => setShowDatePicker(true)}
                    isLast
                  />
                )}
              />
            </GroupedCard>
            {(errors.entity_name || errors.category_id) && (
              <Text className="text-[#93303A] mt-1.5 ml-1 text-xs font-semibold">
                {errors.entity_name?.message || errors.category_id?.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <>
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

          <View className="mb-6">
            <SectionLabel>Como pagou?</SectionLabel>
            <Controller
              control={control}
              name="payment_method"
              render={({ field: { onChange, value } }) => (
                <PaymentMethodSelector value={value} onChange={onChange} />
              )}
            />
          </View>

          <View className="mb-2">
            <SectionLabel>Detalhes (opcional)</SectionLabel>
            <GroupedCard>
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
                    className="px-4 py-3.5 text-[15px] font-semibold text-text-primary min-h-[90px]"
                    textAlignVertical="top"
                    placeholderTextColor="#A0B0B5"
                  />
                )}
              />
            </GroupedCard>
          </View>

          <SaveButton
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            label="Salvar Gasto"
            icon="receipt"
            colors={['#93303A', '#7A2530']}
            shadowColor="#5C1A1E"
          />

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[24px] h-[75%] p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-5 px-2">
              <Text className="text-xl font-bold text-text-primary">O que você comprou?</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)} accessibilityLabel="Fechar">
                <Ionicons name="close-circle" size={28} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            {loadingCategories ? (
              <ActivityIndicator className="mt-10" color="#93303A" />
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
                    className="bg-surface p-4 rounded-2xl mb-3 items-center border border-border"
                  >
                    <View
                      className="w-11 h-11 rounded-full items-center justify-center mb-2.5"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text className="text-text-primary font-semibold text-center text-xs leading-tight">{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showClientModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[24px] h-[75%] p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-5 px-2">
              <Text className="text-xl font-bold text-text-primary">Selecionar Cliente</Text>
              <TouchableOpacity onPress={() => setShowClientModal(false)} accessibilityLabel="Fechar">
                <Ionicons name="close-circle" size={28} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            <View className="mb-4 px-2">
              <View className="flex-row bg-surface rounded-xl items-center px-4 py-3 border border-border">
                <Ionicons name="search-outline" size={18} color="#6B7F85" />
                <TextInput
                  placeholder="Pesquisar cliente..."
                  value={clientSearch}
                  onChangeText={setClientSearch}
                  className="flex-1 ml-3 text-[15px] font-medium text-text-primary"
                  placeholderTextColor="#A0B0B5"
                />
              </View>
            </View>

            {loadingClients ? (
              <ActivityIndicator className="mt-10" color="#93303A" />
            ) : (
              <FlatList
                data={clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
                ListHeaderComponent={
                  <TouchableOpacity
                    onPress={() => {
                      setValue('entity_name', '');
                      setSelectedClientId(null);
                      setShowClientModal(false);
                      setClientSearch('');
                    }}
                    className="p-3.5 flex-row items-center border-b border-border"
                  >
                    <Ionicons name="person-remove-outline" size={20} color="#6B7F85" />
                    <Text className="text-text-secondary font-semibold text-[15px] ml-3">Limpar seleção</Text>
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
                    className="p-3.5 flex-row items-center border-b border-border"
                  >
                    <View className="w-9 h-9 bg-[#93303A]/10 rounded-full items-center justify-center mr-3">
                      <Text className="text-[#93303A] font-bold text-[15px]">{item.name[0]}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-text-primary font-semibold text-[15px]">{item.name}</Text>
                      {item.phone && <Text className="text-text-secondary text-xs mt-0.5">{item.phone}</Text>}
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
