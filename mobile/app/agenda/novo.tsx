import { ClientFormModal } from '@/components/client-form-modal';
import { ScreenHeader } from '@/components/screen-header';
import { useAppointments } from '@/hooks/use-appointments';
import { useClients } from '@/hooks/use-clients';
import { useProfile } from '@/hooks/use-profile';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

const appointmentSchema = z.object({
  service: z.string().optional(),
  price: z.string().optional(),
  notes: z.string().optional(),
  notification_enabled: z.boolean().optional(),
  notification_trigger_minutes: z.number().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;
export default function NovoAgendamento() {
  const router = useRouter();
  const { addAppointment } = useAppointments();
  const { clients, loading: loadingClients } = useClients();
  
  const [loading, setLoading] = useState(false);
  const { showAlert } = useUIStore();
  const { user } = useAuthStore();
  const { profile } = useProfile();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedProfession, setSelectedProfession] = useState<string>('');

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      service: '',
      price: '',
      notes: '',
      notification_enabled: true,
      notification_trigger_minutes: 60,
    }
  });

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

  const handleSelectProfession = (prof: string) => {
    const isSelected = selectedProfession === prof;
    const newProfession = isSelected ? '' : prof;
    setSelectedProfession(newProfession);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    if (!selectedClient) {
      showAlert({
        type: 'info',
        title: 'Falta o cliente',
        message: 'Selecione um cliente para agendar.'
      });
      return;
    }

    if (!selectedProfession && (!data.service || data.service.trim().length < 3)) {
      showAlert({
        type: 'info',
        title: 'O que será feito?',
        message: 'Por favor, escreva o que será feito ou selecione uma profissão.'
      });
      return;
    }

    try {
      setLoading(true);
      
      const numericPrice = data.price 
        ? parseFloat(data.price.replace(/[^\d,]/g, '').replace(',', '.')) 
        : null;

      // Save profession securely inside the notes field to remain fully DB-compatible
      const notesWithProfession = selectedProfession 
        ? `[Profissão: ${selectedProfession}]${data.notes ? '\n\n' + data.notes : ''}`
        : data.notes;

      await addAppointment({
        service: data.service?.trim() || null,
        scheduled_at: date.toISOString(),
        price: numericPrice,
        notes: notesWithProfession || '',
        client_id: selectedClient.id,
        status: 'scheduled',
        notification_enabled: data.notification_enabled,
        notification_trigger_minutes: data.notification_trigger_minutes,
      });

      const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Guerreiro';

      showAlert({
        type: 'success',
        title: `Tudo pronto, ${firstName}!`,
        message: 'O compromisso foi salvo na sua agenda.',
        onConfirm: () => router.replace('/(tabs)/agenda')
      });
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Opa!',
        message: 'Não conseguimos salvar seu agendamento.'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const professions = profile?.professions || [];

  const handleClientCreated = (newClient: any) => {
    setSelectedClient(newClient);
    setShowNewClientModal(false);
    setShowClientModal(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Novo Agendamento" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView 
          className="flex-1 px-6 mt-6" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        
          {/* Card de Valor (Estimado) */}
          <View className="bg-surface rounded-[14px] overflow-hidden mb-6 shadow-sm">
            <View className="p-8 items-center bg-surface">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2">VALOR COMBINADO (OPCIONAL)</Text>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <MaskInput
                    value={value}
                    onChangeText={onChange}
                    mask={Masks.BRL_CURRENCY}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                    className="text-4xl font-black text-text-primary text-center"
                    placeholderTextColor="#A0B0B5"
                  />
                )}
              />
            </View>
          </View>

          {/* Seleção de Cliente */}
          <View className="mb-5">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUEM É O CLIENTE?</Text>
            <TouchableOpacity 
              onPress={() => setShowClientModal(true)}
              activeOpacity={0.7}
              className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
            >
              {selectedClient ? (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-3">
                    <Text className="text-[#0D4F5C] font-black text-base">{selectedClient.name[0]}</Text>
                  </View>
                  <View>
                    <Text className="text-text-primary font-bold text-base">{selectedClient.name}</Text>
                    {selectedClient.phone && <Text className="text-text-secondary font-semibold text-xs">{selectedClient.phone}</Text>}
                  </View>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
                    <Ionicons name="person-outline" size={20} color="#A0B0B5" />
                  </View>
                  <Text className="text-text-hint font-bold text-base">Selecionar cliente...</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
            </TouchableOpacity>
          </View>

          {/* Seleção de Profissão / Serviço */}
          {professions.length > 0 && (
            <View className="mb-5">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUAL PROFISSÃO DESTE SERVIÇO?</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingVertical: 4 }}
              >
                {professions.map((prof: string) => {
                  const isSelected = selectedProfession === prof;
                  return (
                    <TouchableOpacity
                      key={prof}
                      onPress={() => handleSelectProfession(prof)}
                      activeOpacity={0.7}
                      className={`mr-3 px-5 py-3 rounded-[14px] flex-row items-center border ${
                        isSelected 
                          ? 'bg-[#0D4F5C] border-transparent' 
                          : 'bg-surface border-[#E2E8EA]'
                      }`}
                      style={isSelected ? { elevation: 2 } : {}}
                    >
                      <Ionicons 
                        name={getProfessionIcon(prof)} 
                        size={16} 
                        color={isSelected ? 'white' : '#0D4F5C'} 
                      />
                      <Text className={`ml-2 text-sm font-bold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                        {prof}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Serviço */}
          <View className="mb-5">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">O QUE SERÁ FEITO? (OPCIONAL SE TIVER PROFISSÃO)</Text>
            <Controller
              control={control}
              name="service"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: Corte de Cabelo, Faxina..."
                  className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                  placeholderTextColor="#A0B0B5"
                />
              )}
            />
            {errors.service && <Text className="text-[#E05555] mt-1.5 ml-1 text-xs font-bold">{errors.service.message}</Text>}
          </View>

          {/* Data e Hora */}
          <View className="flex-row mb-5 gap-4">
            <View className="flex-1">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUANDO?</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
              >
                <Text className="text-base font-bold text-text-primary">
                  {format(date, "dd/MM/yy")}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#0D4F5C" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">QUE HORAS?</Text>
              <TouchableOpacity 
                onPress={() => setShowTimePicker(true)}
                className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
              >
                <Text className="text-base font-bold text-text-primary">
                  {format(date, "HH:mm")}
                </Text>
                <Ionicons name="time-outline" size={18} color="#0D4F5C" />
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}

          {/* Lembrete de Notificação */}
          <View className="mb-5 bg-surface p-4 rounded-[14px] shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-3">
                  <Ionicons name="notifications" size={20} color="#0D4F5C" />
                </View>
                <View>
                  <Text className="text-text-primary font-bold text-base">Lembrete no celular</Text>
                  <Text className="text-text-secondary font-semibold text-xs">Avisar antes do compromisso</Text>
                </View>
              </View>
              <Controller
                control={control}
                name="notification_enabled"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => onChange(!value)}
                    className={`w-12 h-7 rounded-full p-1 justify-center ${value ? 'bg-[#0D4F5C]' : 'bg-[#E2E8EA]'}`}
                  >
                    <View className={`w-5 h-5 bg-white rounded-full shadow-sm ${value ? 'self-end' : 'self-start'}`} />
                  </TouchableOpacity>
                )}
              />
            </View>

            {watch('notification_enabled') && (
              <View className="mt-4 pt-4 border-t border-[#E2E8EA]/50">
                <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2.5 ml-1">QUANTO TEMPO ANTES?</Text>
                <Controller
                  control={control}
                  name="notification_trigger_minutes"
                  render={({ field: { value, onChange } }) => (
                    <View className="flex-row">
                      {[
                        { label: '5 min', value: 5 },
                        { label: '30 min', value: 30 },
                        { label: '1 hora', value: 60 },
                      ].map((item) => {
                        const isSelected = value === item.value;
                        return (
                          <TouchableOpacity
                            key={item.value}
                            onPress={() => onChange(item.value)}
                            activeOpacity={0.7}
                            className={`mr-3 px-5 py-3 rounded-[12px] flex-1 items-center justify-center border ${
                              isSelected 
                                ? 'bg-[#0D4F5C] border-transparent' 
                                : 'bg-surface border-[#E2E8EA]'
                            }`}
                          >
                            <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                />
              </View>
            )}
          </View>

          {/* Observações */}
          <View className="mb-6">
            <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">RECADO / OBSERVAÇÃO</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Algum detalhe importante?"
                  className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                  placeholderTextColor="#A0B0B5"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            activeOpacity={0.8}
            className="rounded-full mb-20 overflow-hidden shadow-lg shadow-[#0D4F5C]/20"
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
                  <Ionicons name="calendar" size={22} color="white" />
                  <Text className="text-white font-black text-base ml-2 uppercase">Confirmar Agendamento</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Client Modal Selection */}
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
                data={filteredClients}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <TouchableOpacity 
                    onPress={() => { setShowNewClientModal(true); }}
                    className="bg-surface p-4 rounded-[14px] mb-4 flex-row items-center shadow-sm"
                  >
                    <View className="w-10 h-10 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-3">
                      <Ionicons name="add" size={20} color="#0D4F5C" />
                    </View>
                    <Text className="text-[#0D4F5C] font-black text-base">Novo Cliente</Text>
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
                    <Ionicons name="chevron-forward" size={18} color="#A0B0B5" />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* New Client Modal */}
      <ClientFormModal 
        visible={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        onClientCreated={handleClientCreated}
      />

    </SafeAreaView>
  );
}
