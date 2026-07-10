import { PaymentMethodSelector, type PaymentMethod } from '@/components/payment-method-selector';
import { SaveButton } from '@/components/save-button';
import { GroupedCard, GroupedRow, SectionLabel } from '@/components/ui/form-section';
import { ScreenHeader } from '@/components/screen-header';
import { useClients } from '@/hooks/use-clients';
import { useProfile } from '@/hooks/use-profile';
import { useTransactions } from '@/hooks/use-transactions';
import { getFriendlyErrorMessage } from '@/lib/errors';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NovoGanhoScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const { clients, loading: loadingClients } = useClients();
  const { profile } = useProfile();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [status, setStatus] = useState<'concluido' | 'pendente'>('concluido');

  const [incomeMode, setIncomeMode] = useState<'client' | 'quick'>('client');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { showAlert } = useUIStore();

  const getProfessionIcon = (name: string): any => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('cabelo') || lowerName.includes('barber')) return 'cut';
    if (lowerName.includes('unha') || lowerName.includes('manicure')) return 'color-palette';
    if (lowerName.includes('limpeza') || lowerName.includes('faxina')) return 'sparkles';
    if (lowerName.includes('obra') || lowerName.includes('pedreiro')) return 'construct';
    if (lowerName.includes('eletri')) return 'flash';
    if (lowerName.includes('mecanic')) return 'settings';
    if (lowerName.includes('venda')) return 'cart';
    if (lowerName.includes('comida') || lowerName.includes('cozin')) return 'restaurant';
    if (lowerName.includes('entreg')) return 'bicycle';
    if (lowerName.includes('motorista') || lowerName.includes('uber')) return 'car';
    return 'briefcase';
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.')) <= 0) {
      showAlert({
        type: 'error',
        title: 'Valor inválido',
        message: 'Por favor, insira o valor do seu corre.'
      });
      return;
    }

    if (incomeMode === 'client' && !selectedClient && !selectedServiceType) {
      showAlert({
        type: 'info',
        title: 'Faltam dados',
        message: 'Selecione um cliente ou o tipo de serviço que você fez.'
      });
      return;
    }

    if (incomeMode === 'quick' && !title) {
      showAlert({
        type: 'info',
        title: 'O que você fez?',
        message: 'Dê uma descrição rápida para esse ganho.'
      });
      return;
    }

    try {
      setLoading(true);
      const numericAmount = parseFloat(amount.replace(/[^\d,]/g, '').replace(',', '.'));

      await addTransaction({
        type: 'income',
        amount: numericAmount,
        title: title || selectedServiceType,
        payment_method: paymentMethod,
        client_id: selectedClient?.id || null,
        category: selectedServiceType || 'Serviço',
        status: status,
        date: format(date, 'yyyy-MM-dd'),
      });

      const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Guerreiro';

      showAlert({
        type: 'success',
        title: `Boa, ${firstName}!`,
        message: 'Seu ganho foi registrado com sucesso.',
        onConfirm: () => router.back()
      });
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Opa, algo deu errado',
        message: getFriendlyErrorMessage(error, 'Não foi possível salvar o ganho. Tente novamente.')
      });
    } finally {
      setLoading(false);
    }
  };

  const professions = profile?.professions || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Hero */}
      <LinearGradient
        colors={['#0A3D47', '#146B7D']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <ScreenHeader title="Novo Ganho" subtitle="Registre seu corre" transparent />

        <View style={{ paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
            Valor do ganho
          </Text>
          <MaskInput
            value={amount}
            onChangeText={setAmount}
            mask={Masks.BRL_CURRENCY}
            keyboardType="numeric"
            placeholder="R$ 0,00"
            style={{ fontSize: 44, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, fontVariant: ['tabular-nums'] }}
            placeholderTextColor="rgba(255,255,255,0.35)"
            accessibilityLabel="Campo para digitar o valor do ganho"
          />
          <View style={{ width: 56, height: 2, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: 12 }} />
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
          {/* Mode Selection */}
          <View className="flex-row bg-surface p-1 rounded-2xl border border-border mb-6">
            <TouchableOpacity
              onPress={() => setIncomeMode('client')}
              className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
              style={{ gap: 6, backgroundColor: incomeMode === 'client' ? '#0D4F5C' : 'transparent' }}
              accessibilityLabel="Modo cliente"
              accessibilityRole="button"
              accessibilityState={{ selected: incomeMode === 'client' }}
            >
              <Ionicons name="people" size={15} color={incomeMode === 'client' ? 'white' : '#6B7F85'} />
              <Text className={`text-[11px] font-bold tracking-wide ${incomeMode === 'client' ? 'text-white' : 'text-text-secondary'}`}>COM CLIENTE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIncomeMode('quick')}
              className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
              style={{ gap: 6, backgroundColor: incomeMode === 'quick' ? '#4C8A4B' : 'transparent' }}
              accessibilityLabel="Modo rápido"
              accessibilityRole="button"
              accessibilityState={{ selected: incomeMode === 'quick' }}
            >
              <Ionicons name="flash" size={15} color={incomeMode === 'quick' ? 'white' : '#6B7F85'} />
              <Text className={`text-[11px] font-bold tracking-wide ${incomeMode === 'quick' ? 'text-white' : 'text-text-secondary'}`}>CORRE RÁPIDO</Text>
            </TouchableOpacity>
          </View>

          {incomeMode === 'client' ? (
            <View className="mb-6">
              <SectionLabel>Detalhes do corre</SectionLabel>
              <GroupedCard>
                <GroupedRow
                  icon="person"
                  iconColor="#0D4F5C"
                  iconBg="rgba(13, 79, 92, 0.08)"
                  text={selectedClient ? selectedClient.name : 'Selecionar cliente...'}
                  muted={!selectedClient}
                  onPress={() => setShowClientModal(true)}
                />
                <GroupedRow
                  icon="construct"
                  iconColor="#4C8A4B"
                  iconBg="rgba(76, 138, 75, 0.1)"
                  text={selectedServiceType || 'Tipo de serviço...'}
                  muted={!selectedServiceType}
                  onPress={() => setShowServiceModal(true)}
                />
                <View className="flex-row items-center px-4 py-3.5 border-b border-border">
                  <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: '#F5F7F8' }}>
                    <Ionicons name="create-outline" size={17} color="#6B7F85" />
                  </View>
                  <TextInput
                    placeholder="Observação (opcional)"
                    value={title}
                    onChangeText={setTitle}
                    className="flex-1 text-[15px] font-semibold text-text-primary"
                    placeholderTextColor="#A0B0B5"
                  />
                </View>
                <GroupedRow
                  icon="calendar"
                  iconColor="#4C8A4B"
                  iconBg="rgba(76, 138, 75, 0.1)"
                  text={format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  onPress={() => setShowDatePicker(true)}
                  isLast
                />
              </GroupedCard>
            </View>
          ) : (
            <View className="mb-6">
              <SectionLabel>O que você vendeu / fez?</SectionLabel>
              <GroupedCard>
                <View className="px-4 py-3.5 border-b border-border">
                  <TextInput
                    placeholder="Ex: Venda de Avon, Faxina rápida..."
                    value={title}
                    onChangeText={setTitle}
                    className="text-[15px] font-semibold text-text-primary min-h-[60px]"
                    placeholderTextColor="#A0B0B5"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
                <GroupedRow
                  icon="calendar"
                  iconColor="#4C8A4B"
                  iconBg="rgba(76, 138, 75, 0.1)"
                  text={format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  onPress={() => setShowDatePicker(true)}
                  isLast
                />
              </GroupedCard>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          {/* Status Selection */}
          <View className="mb-6">
            <SectionLabel>Status da atividade</SectionLabel>
            <View className="flex-row bg-surface p-1 rounded-2xl border border-border">
              <TouchableOpacity
                onPress={() => setStatus('concluido')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: status === 'concluido' ? '#4C8A4B' : 'transparent' }}
                accessibilityLabel="Marcar atividade como concluída"
                accessibilityRole="button"
                accessibilityState={{ selected: status === 'concluido' }}
              >
                <Ionicons name="checkmark-circle" size={16} color={status === 'concluido' ? 'white' : '#6B7F85'} />
                <Text className={`ml-2 text-[11px] font-bold tracking-wide ${status === 'concluido' ? 'text-white' : 'text-text-secondary'}`}>CONCLUÍDO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatus('pendente')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{ backgroundColor: status === 'pendente' ? '#B07A00' : 'transparent' }}
                accessibilityLabel="Marcar serviço como pendente"
                accessibilityRole="button"
                accessibilityState={{ selected: status === 'pendente' }}
              >
                <Ionicons name="time" size={16} color={status === 'pendente' ? 'white' : '#6B7F85'} />
                <Text className={`ml-2 text-[11px] font-bold tracking-wide ${status === 'pendente' ? 'text-white' : 'text-text-secondary'}`}>PENDENTE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View className="mb-2">
            <SectionLabel>Como recebeu?</SectionLabel>
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
          </View>

          <SaveButton
            onPress={handleSave}
            loading={loading}
            label="Salvar Ganho"
            icon="checkmark-circle"
            colors={['#4C8A4B', '#3D7A3C']}
            shadowColor="#2E5D3D"
          />
        </ScrollView>
      </KeyboardAvoidingView>


      {/* Client Modal */}
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
                {clientSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setClientSearch('')} accessibilityLabel="Limpar busca">
                    <Ionicons name="close-circle" size={18} color="#A0B0B5" />
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
                contentContainerStyle={{ paddingHorizontal: 8 }}
                ListHeaderComponent={
                  <TouchableOpacity
                    onPress={() => { setSelectedClient(null); setShowClientModal(false); setClientSearch(''); }}
                    className="p-3.5 flex-row items-center border-b border-border"
                  >
                    <Ionicons name="person-remove-outline" size={20} color="#6B7F85" />
                    <Text className="text-text-secondary font-semibold text-[15px] ml-3">Nenhum cliente específico</Text>
                  </TouchableOpacity>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setSelectedClient(item); setShowClientModal(false); setClientSearch(''); }}
                    className="p-3.5 flex-row items-center border-b border-border"
                  >
                    <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3">
                      <Text className="text-primary font-bold text-[15px]">{item.name[0]}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-text-primary font-semibold text-[15px] mr-2">{item.name}</Text>
                        {item.is_whatsapp && (
                          <Ionicons name="logo-whatsapp" size={13} color="#4C8A4B" />
                        )}
                      </View>
                      {item.phone && <Text className="text-text-secondary text-xs mt-0.5">{item.phone}</Text>}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Service Modal */}
      <Modal visible={showServiceModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[24px] h-[65%] p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-5 px-2">
              <Text className="text-xl font-bold text-text-primary">Tipo de Serviço</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)} accessibilityLabel="Fechar">
                <Ionicons name="close-circle" size={28} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={professions}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 8 }}
              ListEmptyComponent={
                <View className="items-center justify-center p-8 bg-surface rounded-2xl border border-border">
                  <Ionicons name="alert-circle-outline" size={40} color="#6B7F85" />
                  <Text className="text-text-secondary font-semibold text-center mt-4 text-sm leading-relaxed">
                    Você ainda não cadastrou suas profissões no perfil.
                  </Text>
                  <TouchableOpacity
                    onPress={() => { setShowServiceModal(false); router.push('/perfil/editar'); }}
                    className="mt-6 bg-primary px-6 py-3 rounded-full"
                  >
                    <Text className="text-white font-bold text-xs uppercase tracking-wide">Cadastrar agora</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { setSelectedServiceType(item); setShowServiceModal(false); }}
                  className="p-3.5 flex-row items-center border-b border-border"
                >
                  <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3">
                    <Ionicons name={getProfessionIcon(item)} size={18} color="#0D4F5C" />
                  </View>
                  <Text className="text-text-primary font-semibold text-[15px]">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
