import { ScreenHeader } from '@/components/screen-header';
import { Theme } from '@/constants/theme';
import { useAppointments } from '@/hooks/use-appointments';
import { usePagination } from '@/hooks/use-pagination';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const parseAppointmentProfession = (notes?: string) => {
  if (!notes) return null;
  const match = notes.match(/^\[Profissão:\s*([^\]]+)\]/);
  return match ? match[1] : null;
};

const parseAppointmentNotes = (notes?: string) => {
  if (!notes) return '';
  return notes.replace(/^\[Profissão:\s*[^\]]+\]\s*/, '');
};

export default function AgendaScreen() {
  const router = useRouter();
  const { appointments, loading, fetchAppointments, updateAppointmentStatus, deleteAppointment } = useAppointments();
  
  const { showAlert } = useUIStore();

  // Recarrega os agendamentos toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );
  
  const [activeTab, setActiveTab] = useState<'All' | 'Scheduled' | 'Completed' | 'Cancelled'>('Scheduled');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [finalAmount, setFinalAmount] = useState('');

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'All') return appointments;
    if (activeTab === 'Scheduled') return appointments.filter(a => a.status === 'scheduled');
    if (activeTab === 'Completed') return appointments.filter(a => a.status === 'completed');
    if (activeTab === 'Cancelled') return appointments.filter(a => a.status === 'cancelled');
    return appointments;
  }, [appointments, activeTab]);

  const { visibleData: visibleAppointments, hasMore, loadMore } = usePagination(filteredAppointments, 20, activeTab);

  const handleComplete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setFinalAmount(appointment.price ? `R$ ${appointment.price.toFixed(2).replace('.', ',')}` : '');
    setShowCompleteModal(true);
  };

  const confirmCompletion = async () => {
    if (!selectedAppointment) return;
    
    try {
      const numericAmount = parseFloat(finalAmount.replace(/[^\d,]/g, '').replace(',', '.'));
      
      await updateAppointmentStatus(
        selectedAppointment.id, 
        'completed', 
        numericAmount, 
        selectedAppointment.service,
        selectedAppointment.client_id
      );

      setShowCompleteModal(false);
      setShowDetailModal(false);
      showAlert({
        type: 'success',
        title: 'Serviço Concluído!',
        message: 'O valor foi adicionado aos seus ganhos automaticamente.'
      });
    } catch (error: any) {
      if (error?.message === 'APPOINTMENT_COMPLETED_TRANSACTION_FAILED') {
        setShowCompleteModal(false);
        setShowDetailModal(false);
        showAlert({
          type: 'error',
          title: 'Corre concluído, mas...',
          message: 'O agendamento foi marcado como concluído, mas não conseguimos registrar o ganho automaticamente. Registre esse valor manualmente na tela de Ganhos.'
        });
        return;
      }
      showAlert({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível concluir o agendamento.'
      });
    }
  };

  const handleCancel = async (id: string) => {
    showAlert({
      type: 'info',
      title: 'Cancelar?',
      message: 'Deseja realmente marcar este agendamento como cancelado?',
      onConfirm: async () => {
        try {
          await updateAppointmentStatus(id, 'cancelled');
          setShowDetailModal(false);
          showAlert({
            type: 'success',
            title: 'Cancelado',
            message: 'O agendamento foi marcado como cancelado.'
          });
        } catch {
          showAlert({
            type: 'error',
            title: 'Erro',
            message: 'Não foi possível cancelar o agendamento.'
          });
        }
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader 
        title="Minha Agenda" 
        showBackButton={false} 
      />

      {/* Filtro Fixo */}
      <View className="px-6 pt-4 pb-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
          className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between shadow-sm"
          accessibilityLabel={`Filtro ativo: ${
            activeTab === 'Scheduled' ? 'Próximos' :
            activeTab === 'Completed' ? 'Feitos' :
            activeTab === 'Cancelled' ? 'Cancelados' : 'Todos'
          }. Toque para mudar filtro`}
          accessibilityRole="button"
        >
          <View className="flex-row items-center">
            <View className="w-11 h-11 bg-primary/10 rounded-full items-center justify-center mr-4">
              <Ionicons
                name={
                  activeTab === 'Scheduled' ? 'time-outline' :
                  activeTab === 'Completed' ? 'checkmark-circle-outline' :
                  activeTab === 'Cancelled' ? 'close-circle-outline' : 'list-outline'
                }
                size={22}
                color="#0D4F5C"
              />
            </View>
            <View>
              <Text className="text-text-secondary font-bold text-[11px] uppercase tracking-wider">Visualizando</Text>
              <Text className="text-text-primary font-black text-lg">
                {activeTab === 'Scheduled' ? 'Próximos' :
                 activeTab === 'Completed' ? 'Feitos' :
                 activeTab === 'Cancelled' ? 'Cancelados' : 'Todos'}
              </Text>
            </View>
          </View>
          <View className="bg-white/80 p-2 rounded-full shadow-sm">
            <Ionicons name="options-outline" size={20} color="#0D4F5C" />
          </View>
        </TouchableOpacity>
      </View>

      {loading && (
        <View className="py-8">
          <ActivityIndicator color={Theme.colors.primary} size="large" />
        </View>
      )}

      <FlatList
        data={visibleAppointments}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 160 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          hasMore ? (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#0D4F5C" />
            </View>
          ) : null
        }
        ListEmptyComponent={() => !loading ? (
          <View className="items-center justify-center mt-20 opacity-60">
            <Ionicons name="calendar-outline" size={64} color={Theme.colors.primary} />
            <Text className="text-text-primary text-xl font-bold mt-4">Nada por aqui...</Text>
            <Text className="text-text-secondary text-center px-10 mt-2">
              Sua agenda está vazia para este filtro. Que tal marcar um novo corre?
            </Text>
          </View>
        ) : null}
        renderItem={({ item }) => {
          const profession = parseAppointmentProfession(item.notes);
          const displayTitle = item.service || profession || 'Serviço';
          const showProfessionBadge = profession && item.service && item.service.toLowerCase() !== profession.toLowerCase();
          const notifMins = item.notification_trigger_minutes ?? 60;
          const notifLabel = notifMins === 5 ? '5min' : notifMins === 30 ? '30min' : '1h';

          const statusColor =
            item.status === 'completed' ? '#7BC67A' :
            item.status === 'cancelled' ? '#E05555' : '#0D4F5C';

          return (
            <TouchableOpacity
              onPress={() => {
                setSelectedAppointment(item);
                setShowDetailModal(true);
              }}
              activeOpacity={0.7}
              className="px-4 py-4 rounded-2xl mb-4 bg-white border border-border shadow-sm"
              style={{ borderLeftWidth: 4, borderLeftColor: statusColor }}
              accessibilityLabel={`${displayTitle} com ${item.clients?.name?.split(' ')[0] || 'cliente'}. Toque para ver detalhes`}
              accessibilityRole="button"
            >
              {/* Cabeçalho: Status */}
              <View className="flex-row justify-end items-center mb-3">
                <View className={`px-3 py-1.5 rounded-full ${
                  item.status === 'completed' ? 'bg-[#7BC67A]/20' :
                  item.status === 'cancelled' ? 'bg-[#E05555]/20' : 'bg-[#0D4F5C]/15'
                }`}>
                  <Text className={`font-black text-[11px] uppercase tracking-wider ${
                    item.status === 'completed' ? 'text-[#7BC67A]' :
                    item.status === 'cancelled' ? 'text-[#E05555]' : 'text-[#0D4F5C]'
                  }`}>
                    {item.status === 'completed' ? '✓ Concluído' :
                     item.status === 'cancelled' ? '✕ Cancelado' : '◷ Agendado'}
                  </Text>
                </View>
              </View>

              {/* Descrição do serviço - DESTAQUE */}
              <View className="mb-4">
                <Text className="text-xl font-black text-text-primary leading-tight">
                  {displayTitle}
                </Text>
                {showProfessionBadge && (
                  <View className="flex-row items-center mt-2">
                    <Ionicons name={getProfessionIcon(profession!)} size={14} color="#0D4F5C" />
                    <Text className="text-[#0D4F5C] font-bold text-xs ml-1.5">{profession}</Text>
                  </View>
                )}
              </View>

              {/* Informações organizadas em blocos */}
              <View className="bg-surface rounded-xl p-3 mb-3">
                {/* Cliente */}
                <View className="flex-row items-center mb-2.5">
                  <View className="w-8 h-8 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-2.5">
                    <Ionicons name="person" size={14} color="#0D4F5C" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] text-text-secondary font-bold uppercase tracking-wide">Cliente</Text>
                    <Text className="text-sm font-black text-text-primary" numberOfLines={1}>
                      {item.clients?.name || 'Não identificado'}
                    </Text>
                  </View>
                </View>

                {/* Data e Hora */}
                <View className="flex-row gap-3">
                  <View className="flex-1 flex-row items-center">
                    <View className="w-8 h-8 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-2.5">
                      <Ionicons name="calendar" size={14} color="#0D4F5C" />
                    </View>
                    <View>
                      <Text className="text-[11px] text-text-secondary font-bold uppercase tracking-wide">Data</Text>
                      <Text className="text-sm font-black text-text-primary">
                        {format(new Date(item.scheduled_at), "dd/MM/yy")}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1 flex-row items-center">
                    <View className="w-8 h-8 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-2.5">
                      <Ionicons name="time" size={14} color="#0D4F5C" />
                    </View>
                    <View>
                      <Text className="text-[11px] text-text-secondary font-bold uppercase tracking-wide">Hora</Text>
                      <Text className="text-sm font-black text-text-primary">
                        {format(new Date(item.scheduled_at), "HH:mm")}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Valor e Notificação */}
              <View className="flex-row gap-2 mb-3">
                {item.price > 0 && (
                  <View className="flex-1 bg-[#7BC67A]/15 rounded-[10px] px-3 py-2 flex-row items-center justify-between">
                    <View>
                      <Text className="text-[11px] text-[#0D4F5C] font-bold uppercase tracking-wide">Valor</Text>
                      <Text className="text-base font-black text-[#7BC67A]">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </Text>
                    </View>
                    <Ionicons name="cash" size={20} color="#7BC67A" />
                  </View>
                )}

                {item.notification_enabled !== false && (
                  <View className="bg-[#0D4F5C]/10 rounded-[10px] px-3 py-2 flex-row items-center gap-2">
                    <Ionicons name="notifications" size={16} color="#0D4F5C" />
                    <View>
                      <Text className="text-[11px] text-text-secondary font-bold uppercase tracking-wide">Lembrete</Text>
                      <Text className="text-xs font-black text-[#0D4F5C]">{notifLabel}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Botões de ação (só para agendados) */}
              {item.status === 'scheduled' && (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleComplete(item)}
                    className="flex-1 bg-[#7BC67A] py-3 rounded-full flex-row items-center justify-center"
                    accessibilityLabel={`Concluir ${displayTitle}`}
                    accessibilityRole="button"
                    style={{ minHeight: 48 }}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="white" />
                    <Text className="text-white font-black ml-2 uppercase text-xs tracking-wide">Concluir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      showAlert({
                        type: 'info',
                        title: 'Remover?',
                        message: 'Deseja realmente remover este agendamento?',
                        showCancel: true,
                        confirmText: 'SIM, REMOVER',
                        cancelText: 'NÃO, VOLTAR',
                        onConfirm: () => deleteAppointment(item.id)
                      });
                    }}
                    className="w-12 h-12 bg-surface rounded-full items-center justify-center"
                    accessibilityLabel={`Remover ${displayTitle}`}
                    accessibilityRole="button"
                  >
                    <Ionicons name="trash-outline" size={18} color="#E05555" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Floating Action Button - Fixed Position above TabBar */}
      <TouchableOpacity
        onPress={() => router.push('/agenda/novo')}
        activeOpacity={0.9}
        accessibilityLabel="Adicionar novo agendamento"
        accessibilityRole="button"
        style={{
          position: 'absolute',
          bottom: 110,
          right: 25,
          width: 64,
          height: 64,
          borderRadius: 32,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 12,
          shadowColor: '#0D4F5C',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          zIndex: 9999,
        }}
      >
        <LinearGradient
          colors={['#0D4F5C', '#1A6B7A']}
          style={{ width: '100%', height: '100%', borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={36} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Selection Modal */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[20px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">Filtrar Agenda</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                accessibilityLabel="Fechar filtro"
                accessibilityRole="button"
              >
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            <View className="gap-3">
              {[
                { id: 'Scheduled', label: 'Próximos', icon: 'time-outline', color: '#0D4F5C', bg: 'rgba(13, 79, 92, 0.08)' },
                { id: 'Completed', label: 'Feitos', icon: 'checkmark-circle-outline', color: '#7BC67A', bg: 'rgba(123, 198, 122, 0.12)' },
                { id: 'Cancelled', label: 'Cancelados', icon: 'close-circle-outline', color: '#E05555', bg: 'rgba(224, 85, 85, 0.1)' },
                { id: 'All', label: 'Todos', icon: 'list-outline', color: '#6B7F85', bg: '#F5F7F8' }
              ].map((filter) => {
                const isActive = activeTab === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => {
                      setActiveTab(filter.id as any);
                      setShowFilterModal(false);
                    }}
                    className={`p-4 rounded-[14px] flex-row items-center ${isActive ? 'bg-surface shadow-sm' : 'bg-white shadow-sm'}`}
                    accessibilityLabel={`Filtrar por ${filter.label}`}
                    accessibilityRole="button"
                  >
                    <View 
                      style={{ backgroundColor: filter.bg }}
                      className="w-12 h-12 rounded-[10px] items-center justify-center mr-4"
                    >
                      <Ionicons name={filter.icon as any} size={24} color={filter.color} />
                    </View>
                    <View className="flex-1">
                      <Text className={`text-lg font-black ${isActive ? 'text-primary' : 'text-text-primary'}`}>
                        {filter.label}
                      </Text>
                      <Text className="text-text-secondary font-medium text-xs">Ver {filter.label.toLowerCase()}</Text>
                    </View>
                    {isActive && <Ionicons name="checkmark-circle" size={24} color="#0D4F5C" />}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View className="h-10" />
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[20px] p-8 h-[85%] shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">Detalhes</Text>
              <TouchableOpacity
                onPress={() => setShowDetailModal(false)}
                accessibilityLabel="Fechar detalhes"
                accessibilityRole="button"
              >
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedAppointment && (
                <View>
                  <View className="bg-white p-6 rounded-[14px] mb-6 shadow-sm">
                    <View className={`self-start px-3 py-1 rounded-full mb-3 ${
                      selectedAppointment.status === 'completed' ? 'bg-[#7BC67A]/10' : 
                      selectedAppointment.status === 'cancelled' ? 'bg-[#E05555]/10' : 'bg-[#0D4F5C]/10'
                    }`}>
                      <Text className={`font-black text-[11px] uppercase tracking-wider ${
                        selectedAppointment.status === 'completed' ? 'text-[#7BC67A]' : 
                        selectedAppointment.status === 'cancelled' ? 'text-[#E05555]' : 'text-[#0D4F5C]'
                      }`}>
                        {selectedAppointment.status === 'completed' ? 'Concluído' : 
                         selectedAppointment.status === 'cancelled' ? 'Cancelado' : 'Agendado'}
                      </Text>
                    </View>
                    
                    <Text className="text-3xl font-black text-text-primary mb-2 leading-tight">
                      {selectedAppointment.service || parseAppointmentProfession(selectedAppointment.notes) || 'Serviço'}
                    </Text>
                    
                    <View className="flex-row items-center mt-4 bg-surface p-4 rounded-[14px] shadow-sm">
                      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                        <Text className="text-primary font-black text-base">
                          {selectedAppointment.clients?.name?.[0] || '?'}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-text-secondary font-bold text-[11px] uppercase tracking-wider">Cliente</Text>
                        <Text className="text-text-primary font-black text-base">
                          {selectedAppointment.clients?.name || 'Não identificado'}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row mt-4 gap-4">
                      <View className="flex-1 bg-surface p-3.5 rounded-[12px] items-center shadow-sm">
                        <Ionicons name="calendar-outline" size={18} color="#6B7F85" />
                        <Text className="text-text-secondary font-bold text-[11px] uppercase mt-1">Data</Text>
                        <Text className="text-text-primary font-black text-sm mt-0.5">
                          {format(new Date(selectedAppointment.scheduled_at), "dd/MM/yy")}
                        </Text>
                      </View>
                      <View className="flex-1 bg-surface p-3.5 rounded-[12px] items-center shadow-sm">
                        <Ionicons name="time-outline" size={18} color="#6B7F85" />
                        <Text className="text-text-secondary font-bold text-[11px] uppercase mt-1">Hora</Text>
                        <Text className="text-text-primary font-black text-sm mt-0.5">
                          {format(new Date(selectedAppointment.scheduled_at), "HH:mm")}
                        </Text>
                      </View>
                    </View>

                     {selectedAppointment.price > 0 && (
                       <View className="mt-4 bg-[#7BC67A]/10 p-5 rounded-[14px] items-center flex-row justify-between">
                         <View>
                           <Text className="text-[#0D4F5C] font-bold text-[11px] uppercase tracking-wider">Valor Estimado</Text>
                           <Text className="text-[#0D4F5C] font-black text-xl mt-0.5">R$ {selectedAppointment.price.toFixed(2)}</Text>
                         </View>
                         <Ionicons name="cash-outline" size={28} color="#7BC67A" />
                       </View>
                     )}

                     {(() => {
                       const profession = parseAppointmentProfession(selectedAppointment.notes);
                       const cleanNotes = parseAppointmentNotes(selectedAppointment.notes);
                       return (
                         <>
                           {profession && selectedAppointment.service && selectedAppointment.service.toLowerCase() !== profession.toLowerCase() && (
                             <View className="mt-4">
                               <Text className="text-text-secondary font-bold text-[11px] uppercase tracking-wider ml-1 mb-1.5">Profissão Vinculada</Text>
                               <View className="bg-surface p-4 rounded-[14px] flex-row items-center">
                                 <Ionicons name={getProfessionIcon(profession)} size={20} color="#0D4F5C" />
                                 <Text className="text-text-primary font-bold text-sm ml-2">{profession}</Text>
                               </View>
                             </View>
                           )}

                            {/* Informações de Notificação */}
                            <View className="mt-4">
                              <Text className="text-text-secondary font-bold text-[11px] uppercase tracking-wider ml-1 mb-1.5">Lembrete no Celular</Text>
                              <View className="bg-surface p-4 rounded-[14px] flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                  <Ionicons 
                                    name={selectedAppointment.notification_enabled !== false ? "notifications" : "notifications-off"} 
                                    size={20} 
                                    color={selectedAppointment.notification_enabled !== false ? "#0D4F5C" : "#A0B0B5"} 
                                  />
                                  <Text className={`text-sm font-bold ml-2 ${selectedAppointment.notification_enabled !== false ? 'text-text-primary' : 'text-text-secondary'}`}>
                                    {selectedAppointment.notification_enabled !== false ? 'Ativado' : 'Desativado'}
                                  </Text>
                                </View>
                                {selectedAppointment.notification_enabled !== false && (
                                  <View className="bg-[#0D4F5C]/10 px-3 py-1.5 rounded-full">
                                    <Text className="text-[#0D4F5C] font-black text-xs">
                                      {(() => {
                                        const mins = selectedAppointment.notification_trigger_minutes ?? 60;
                                        if (mins === 5) return '5 min antes';
                                        if (mins === 30) return '30 min antes';
                                        return '1 hora antes';
                                      })()}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>

                           {cleanNotes.trim().length > 0 && (
                             <View className="mt-4">
                               <Text className="text-text-secondary font-bold text-[11px] uppercase tracking-wider ml-1 mb-1.5">Observações</Text>
                               <View className="bg-surface p-4 rounded-[14px] shadow-sm">
                                 <Text className="text-text-primary font-medium leading-5 text-sm">{cleanNotes}</Text>
                               </View>
                             </View>
                           )}
                         </>
                       );
                     })()}
                  </View>

                  {/* Actions */}
                  <View className="mb-10">
                    {selectedAppointment.status === 'scheduled' && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleComplete(selectedAppointment)}
                          className="bg-[#7BC67A] p-4 rounded-full flex-row items-center justify-center shadow-md mb-3"
                          style={{ minHeight: 52 }}
                          accessibilityLabel="Concluir serviço"
                          accessibilityRole="button"
                        >
                          <Ionicons name="checkmark-circle" size={22} color="white" />
                          <Text className="text-white font-black text-base ml-1.5 uppercase">Concluir Serviço</Text>
                        </TouchableOpacity>

                        <View className="flex-row gap-3 mb-3">
                          <TouchableOpacity
                            onPress={() => {
                              setShowDetailModal(false);
                              router.push(`/agenda/${selectedAppointment.id}`);
                            }}
                            className="flex-1 bg-white p-4 rounded-full flex-row items-center justify-center shadow-sm"
                            style={{ minHeight: 52 }}
                            accessibilityLabel="Editar agendamento"
                            accessibilityRole="button"
                          >
                            <Ionicons name="create-outline" size={20} color="#0D4F5C" />
                            <Text className="text-primary font-black ml-1.5 uppercase text-xs">Editar</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => handleCancel(selectedAppointment.id)}
                            className="flex-1 bg-white p-4 rounded-full flex-row items-center justify-center shadow-sm"
                            style={{ minHeight: 52 }}
                            accessibilityLabel="Cancelar agendamento"
                            accessibilityRole="button"
                          >
                            <Ionicons name="close-circle-outline" size={20} color="#E05555" />
                            <Text className="text-[#E05555] font-black ml-1.5 uppercase text-xs">Cancelar</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    <TouchableOpacity 
                      onPress={() => {
                        showAlert({
                          type: 'info',
                          title: 'Remover?',
                          message: 'Deseja realmente remover este agendamento?',
                          showCancel: true,
                          confirmText: 'SIM, REMOVER',
                          cancelText: 'NÃO, VOLTAR',
                          onConfirm: async () => {
                            await deleteAppointment(selectedAppointment.id);
                            setShowDetailModal(false);
                          }
                        });
                      }}
                      className="bg-surface p-4 rounded-full flex-row items-center justify-center shadow-sm"
                      style={{ minHeight: 52 }}
                    >
                      <Ionicons name="trash-outline" size={20} color="#6B7F85" />
                      <Text className="text-text-secondary font-black ml-1.5 uppercase text-xs">Excluir Registro</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal visible={showCompleteModal} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-[20px] p-8 shadow-2xl">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-[#7BC67A]/10 rounded-full items-center justify-center mb-3">
                <Ionicons name="checkmark-done" size={32} color="#7BC67A" />
              </View>
              <Text className="text-xl font-black text-text-primary text-center">Finalizar Atendimento</Text>
              <Text className="text-text-secondary font-medium text-center mt-1 text-sm">
                Confirme o valor recebido por este serviço:
              </Text>
            </View>

            <View className="bg-surface rounded-[14px] p-4 mb-6 shadow-sm">
              <MaskInput
                value={finalAmount}
                onChangeText={setFinalAmount}
                mask={Masks.BRL_CURRENCY}
                keyboardType="numeric"
                className="text-3xl font-black text-text-primary text-center"
                autoFocus
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setShowCompleteModal(false)}
                className="flex-1 rounded-full bg-surface px-6 py-4 flex-row items-center justify-center shadow-sm"
                style={{ minHeight: 56 }}
              >
                <Ionicons name="arrow-back-outline" size={20} color="#6B7F85" />
                <Text className="text-text-secondary font-black uppercase text-xs ml-2">Voltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={confirmCompletion}
                className="flex-1 rounded-full bg-[#7BC67A] px-6 py-4 flex-row items-center justify-center shadow-md shadow-success/10"
                style={{ minHeight: 56 }}
              >
                <Ionicons name="cash-outline" size={20} color="white" />
                <Text className="text-white font-black uppercase text-xs ml-2">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
