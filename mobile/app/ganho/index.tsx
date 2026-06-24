import { ScreenHeader } from '@/components/screen-header';
import { useClients } from '@/hooks/use-clients';
import { useProfile } from '@/hooks/use-profile';
import { useTransactions } from '@/hooks/use-transactions';
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
  const { profile, loading: loadingProfile } = useProfile();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash' | 'card'>('pix');
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
        message: error.message || 'Não foi possível salvar o ganho. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const professions = profile?.professions || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      {/* Hero Header */}
      <LinearGradient
        colors={['#0D4F5C', '#1A6B7A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <ScreenHeader title="Novo Ganho" subtitle="Registre seu corre" transparent />

        {/* Amount Card flutuante */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28, alignItems: 'center' }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            VALOR DO GANHO
          </Text>
          <MaskInput
            value={amount}
            onChangeText={setAmount}
            mask={Masks.BRL_CURRENCY}
            keyboardType="numeric"
            placeholder="R$ 0,00"
            style={{ fontSize: 44, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1 }}
            placeholderTextColor="rgba(255,255,255,0.35)"
            accessibilityLabel="Campo para digitar o valor do ganho"
          />
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
          {/* Mode Selection */}
          <View style={{ flexDirection: 'row', backgroundColor: '#F5F7F8', padding: 5, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8EA', marginBottom: 22 }}>
            <TouchableOpacity
              onPress={() => setIncomeMode('client')}
              style={[
                { flex: 1, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
                incomeMode === 'client' && { backgroundColor: '#0D4F5C', shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }
              ]}
              accessibilityLabel="Modo cliente"
            >
              <Ionicons name="people" size={16} color={incomeMode === 'client' ? 'white' : '#6B7F85'} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: incomeMode === 'client' ? 'white' : '#6B7F85', letterSpacing: 0.5 }}>COM CLIENTE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIncomeMode('quick')}
              style={[
                { flex: 1, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
                incomeMode === 'quick' && { backgroundColor: '#7BC67A', shadowColor: '#7BC67A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }
              ]}
              accessibilityLabel="Modo rápido"
            >
              <Ionicons name="flash" size={16} color={incomeMode === 'quick' ? 'white' : '#6B7F85'} />
              <Text style={{ fontSize: 11, fontWeight: '800', color: incomeMode === 'quick' ? 'white' : '#6B7F85', letterSpacing: 0.5 }}>CORRE RÁPIDO</Text>
            </TouchableOpacity>
          </View>

          {incomeMode === 'client' ? (
            <>
              {/* Client Selection */}
              <View className="mb-5">
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUEM VOCÊ ATENDEU?</Text>
                <TouchableOpacity 
                  onPress={() => setShowClientModal(true)}
                  className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-3">
                      <Ionicons name="person" size={20} color="#0D4F5C" />
                    </View>
                    <Text className={`text-base font-bold ${selectedClient ? 'text-text-primary' : 'text-text-hint'}`}>
                      {selectedClient ? selectedClient.name : 'Selecionar cliente...'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
                </TouchableOpacity>
              </View>

              {/* Service Type Selection */}
              <View className="mb-5">
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">O QUE FOI FEITO?</Text>
                <TouchableOpacity 
                  onPress={() => setShowServiceModal(true)}
                  className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-[#7BC67A]/15 rounded-full items-center justify-center mr-3">
                      <Ionicons name="construct" size={20} color="#7BC67A" />
                    </View>
                    <Text className={`text-base font-bold ${selectedServiceType ? 'text-text-primary' : 'text-text-hint'}`}>
                      {selectedServiceType ? selectedServiceType : 'Tipo de serviço...'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
                </TouchableOpacity>
                <TextInput
                  placeholder="Observação (opcional)"
                  value={title}
                  onChangeText={setTitle}
                  className="bg-surface p-4 rounded-[10px] mt-3 text-base font-semibold text-text-primary shadow-sm"
                  placeholderTextColor="#A0B0B5"
                />
              </View>
            </>
          ) : (
            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">O QUE VOCÊ VENDEU / FEZ?</Text>
              <TextInput
                placeholder="Ex: Venda de Avon, Faxina rápida..."
                value={title}
                onChangeText={setTitle}
                className="bg-surface p-5 rounded-[14px] text-base font-semibold text-text-primary shadow-sm"
                placeholderTextColor="#A0B0B5"
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Date Selection */}
          <View className="mb-5">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUANDO FOI ISSO?</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
              className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#7BC67A]/15 rounded-full items-center justify-center mr-3">
                  <Ionicons name="calendar" size={20} color="#7BC67A" />
                </View>
                <Text className="text-base font-bold text-text-primary">
                  {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
            </TouchableOpacity>

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
          </View>

          {/* Status Selection */}
          <View className="mb-5">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">STATUS DA ATIVIDADE</Text>
            <View className="flex-row bg-surface p-1.5 rounded-[14px] shadow-sm">
              <TouchableOpacity 
                onPress={() => setStatus('concluido')}
                className={`flex-1 py-3 rounded-[10px] flex-row items-center justify-center ${status === 'concluido' ? 'bg-[#7BC67A]' : ''}`}
                accessibilityLabel="Marcar atividade como concluída"
                accessibilityRole="button"
              >
                <Ionicons name="checkmark-circle" size={18} color={status === 'concluido' ? 'white' : '#6B7F85'} />
                <Text className={`ml-2 text-xs font-black ${status === 'concluido' ? 'text-white' : 'text-text-secondary'}`}>CONCLUÍDO</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setStatus('pendente')}
                className={`flex-1 py-3 rounded-[10px] flex-row items-center justify-center ${status === 'pendente' ? 'bg-[#F0A500]' : ''}`}
                accessibilityLabel="Marcar serviço como pendente"
                accessibilityRole="button"
              >
                <Ionicons name="time" size={18} color={status === 'pendente' ? 'white' : '#6B7F85'} />
                <Text className={`ml-2 text-xs font-black ${status === 'pendente' ? 'text-white' : 'text-text-secondary'}`}>PENDENTE</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">COMO RECEBEU?</Text>
            <View className="flex-row justify-between gap-3">
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
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
            style={{ borderRadius: 999, overflow: 'hidden', marginTop: 24, marginBottom: 100, shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 }}
            accessibilityLabel="Salvar ganho"
          >
            <LinearGradient
              colors={loading ? ['#C5D0D3', '#C5D0D3'] : ['#7BC67A', '#5AA858']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ height: 58, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="white" />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }}>Salvar Ganho</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>


      {/* Client Modal */}
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
                    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
                      <Text className="text-primary font-black text-base">{item.name[0]}</Text>
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

      {/* Service Modal */}
      <Modal visible={showServiceModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[20px] h-[65%] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">Tipo de Serviço</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={professions}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View className="items-center justify-center p-8 bg-surface rounded-[14px] shadow-sm">
                  <Ionicons name="alert-circle-outline" size={48} color="#6B7F85" />
                  <Text className="text-text-secondary font-bold text-center mt-4 text-sm leading-relaxed">
                    Você ainda não cadastrou suas profissões no perfil.
                  </Text>
                  <TouchableOpacity 
                    onPress={() => { setShowServiceModal(false); router.push('/perfil/editar'); }}
                    className="mt-6 bg-primary px-6 py-3 rounded-full"
                  >
                    <Text className="text-white font-black text-xs uppercase">CADASTRAR AGORA</Text>
                  </TouchableOpacity>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => { setSelectedServiceType(item); setShowServiceModal(false); }}
                  className="bg-white p-4 rounded-[14px] mb-3 flex-row items-center shadow-sm"
                >
                  <View className="w-10 h-10 bg-primary/10 rounded-[10px] items-center justify-center mr-4">
                    <Ionicons name={getProfessionIcon(item)} size={20} color="#0D4F5C" />
                  </View>
                  <Text className="text-text-primary font-black text-base">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
