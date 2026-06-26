import { openWhatsApp } from '@/lib/whatsapp';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useAppointments } from '@/hooks/use-appointments';
import { Client, useClients } from '@/hooks/use-clients';
import { useTransactions } from '@/hooks/use-transactions';
import { getFriendlyErrorMessage } from '@/lib/errors';
import { useUIStore } from '@/stores/ui';

export default function DetalhesClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const { clients, deleteClient, fetchClients } = useClients();
  const navigation = useNavigation();
  const { showAlert } = useUIStore();
  
  const [client, setClient] = useState<Client | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { transactions, setFilters } = useTransactions({ clientId, type: 'income' });

  useEffect(() => {
    // Converte datas do formato DD/MM/AAAA para AAAA-MM-DD para o Supabase
    const formatToDb = (date: string) => {
      if (!date || date.length < 10) return undefined;
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    };

    setFilters(prev => ({
      ...prev,
      startDate: formatToDb(startDate),
      endDate: formatToDb(endDate),
    }));
  }, [startDate, endDate]);

  const { appointments } = useAppointments();

  const clientAppointments = appointments.filter(a => a.client_id === clientId);
  const clientTransactions = transactions.filter(t => t.client_id === clientId && t.type === 'income');

  const totalSpent = clientTransactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClients();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const foundClient = clients.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
    }
  }, [clientId, clients]);

  const handleDelete = () => {
    showAlert({
      type: 'error',
      title: 'Excluir Cliente?',
      message: 'Tem certeza? Todos os dados desse cliente serão apagados.',
      showCancel: true,
      confirmText: 'SIM, EXCLUIR',
      cancelText: 'NÃO, MANTER',
      onConfirm: async () => {
        try {
          await deleteClient(clientId);
          router.back();
        } catch (error: any) {
          showAlert({ type: 'error', title: 'Erro', message: getFriendlyErrorMessage(error, 'Não foi possível excluir o cliente.') });
        }
      }
    });
  };

  const handleOpenWhatsApp = async () => {
    if (!client?.phone) return;
    await openWhatsApp(client.phone);
  };

  const makeCall = (phoneType: 'mobile' | 'fixed') => {
    const phone = phoneType === 'mobile' ? client?.phone : client?.phone_fixed;
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`tel:${cleanPhone}`);
  };

  const openInMaps = () => {
    if (!client) return;
    const address = `${client.address_street}, ${client.address_number}, ${client.address_neighborhood}, ${client.address_city} - ${client.address_state}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });
    if (url) Linking.openURL(url);
  };

  if (!client) return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator color="#0D4F5C" size="large" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader 
        title="Dados do Cliente" 
        rightElement={
          <TouchableOpacity 
            onPress={() => router.push(`/cliente/editar/${clientId}`)} 
            style={{ backgroundColor: 'rgba(13, 79, 92, 0.15)' }} 
            className="p-2.5 rounded-[12px]"
            accessibilityLabel="Editar cliente"
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={20} color="#0D4F5C" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        className="flex-1 px-6 mt-6" 
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-20">
          {/* Card de Nome e Contato */}
          <View className="bg-surface p-6 rounded-[14px] border border-border items-center mb-6 shadow-sm">
            <View style={{ backgroundColor: 'rgba(13, 79, 92, 0.10)' }} className="w-20 h-20 rounded-full items-center justify-center mb-4 relative border border-border">
              <Text className="text-[#0D4F5C] font-black text-3xl">{client.name[0].toUpperCase()}</Text>
              {client.is_whatsapp && (
                <View className="absolute -right-1 -bottom-1 bg-[#7BC67A] w-7 h-7 rounded-full items-center justify-center border-2 border-surface">
                  <Ionicons name="logo-whatsapp" size={14} color="white" />
                </View>
              )}
            </View>
            
            <Text className="text-text-primary font-black text-xl leading-tight text-center mb-1">{client.name}</Text>
            
            <View className="flex-row items-center justify-center flex-wrap">
              <Text className="text-text-secondary font-bold text-sm">{client.phone}</Text>
              {client.phone_fixed ? (
                <>
                  <View className="w-1.5 h-1.5 rounded-full bg-divider mx-2.5" />
                  <Text className="text-text-secondary font-bold text-sm">{client.phone_fixed}</Text>
                </>
              ) : null}
            </View>
            
            <View className="flex-row mt-6 gap-4">
              {client.is_whatsapp && (
                <TouchableOpacity onPress={handleOpenWhatsApp} className="bg-[#7BC67A] w-12 h-12 rounded-[12px] items-center justify-center shadow-md" activeOpacity={0.7}>
                  <Ionicons name="logo-whatsapp" size={22} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => makeCall('mobile')} className="bg-[#0D4F5C] w-12 h-12 rounded-[12px] items-center justify-center shadow-md" activeOpacity={0.7}>
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
              {client.phone_fixed && (
                <TouchableOpacity onPress={() => makeCall('fixed')} className="bg-text-secondary w-12 h-12 rounded-[12px] items-center justify-center shadow-md" activeOpacity={0.7}>
                  <Ionicons name="business" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Resumo Financeiro */}
          <View className="bg-surface p-4 rounded-[14px] border border-border flex-row items-center justify-between mb-6 shadow-sm">
            <View>
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-1">Total recebido</Text>
              <Text className="text-[#7BC67A] font-black text-2xl leading-none">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
              </Text>
            </View>
             <View style={{ backgroundColor: 'rgba(123, 198, 122, 0.15)' }} className="w-12 h-12 rounded-[12px] items-center justify-center">
              <Ionicons name="wallet-outline" size={22} color="#7BC67A" />
            </View>
          </View>

          {/* Endereço — só exibe se houver pelo menos um campo preenchido */}
          {(client.address_street || client.address_city || client.address_neighborhood) && (
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={openInMaps}
              className="bg-surface p-4 rounded-[14px] border border-border mb-6 shadow-sm"
            >
              <View className="flex-row items-center justify-between mb-3.5">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={18} color="#0D4F5C" />
                  <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider ml-2">Endereço</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-[#0D4F5C] font-black text-[10px] uppercase tracking-wider">Ver no mapa</Text>
                  <Ionicons name="chevron-forward" size={12} color="#0D4F5C" className="ml-1" />
                </View>
              </View>
              <Text className="text-text-primary font-bold text-sm leading-tight">
                {[client.address_street, client.address_number].filter(Boolean).join(', ')}
              </Text>
              <Text className="text-text-secondary font-semibold text-xs mt-1">
                {[client.address_neighborhood, client.address_city, client.address_state].filter(Boolean).join(' • ')}
              </Text>
            </TouchableOpacity>
          )}

          {/* Histórico de Atendimento */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4 px-1">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider">Histórico de Atendimento</Text>
              <TouchableOpacity 
                onPress={() => setShowDateFilter(!showDateFilter)}
                style={{ backgroundColor: showDateFilter ? '#0D4F5C' : 'rgba(13, 79, 92, 0.10)' }}
                className="flex-row items-center px-3 py-1.5 rounded-full"
              >
                <Ionicons name="calendar-outline" size={12} color={showDateFilter ? 'white' : '#0D4F5C'} />
                <Text className={`font-bold text-[10px] ml-1 uppercase ${showDateFilter ? 'text-white' : 'text-[#0D4F5C]'}`}>
                  Filtros
                </Text>
              </TouchableOpacity>
            </View>

            {showDateFilter && (
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1 bg-surface px-4 py-3 rounded-[10px] border border-border shadow-sm">
                  <Text className="text-[9px] font-black text-text-secondary uppercase mb-1">Início</Text>
                  <MaskInput
                    value={startDate}
                    onChangeText={setStartDate}
                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#A0B0B5"
                    keyboardType="numeric"
                    className="text-text-primary font-black text-xs p-0 m-0"
                  />
                </View>
                <View className="flex-1 bg-surface px-4 py-3 rounded-[10px] border border-border shadow-sm">
                  <Text className="text-[9px] font-black text-text-secondary uppercase mb-1">Fim</Text>
                  <MaskInput
                    value={endDate}
                    onChangeText={setEndDate}
                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#A0B0B5"
                    keyboardType="numeric"
                    className="text-text-primary font-black text-xs p-0 m-0"
                  />
                </View>
              </View>
            )}

            {clientTransactions.length === 0 ? (
              <View className="bg-surface py-8 rounded-[14px] items-center justify-center border border-border">
                <Ionicons name="receipt-outline" size={32} color="#A0B0B5" />
                <Text className="text-text-secondary font-semibold text-xs mt-2 text-center">Nenhum atendimento ou ganho registrado.</Text>
              </View>
            ) : (
              <View className="gap-3">
                {clientTransactions.slice(0, 5).map((t) => (
                  <TouchableOpacity 
                    key={t.id}
                    onPress={() => {
                      setSelectedTransaction(t);
                      setShowTransactionModal(true);
                    }}
                    activeOpacity={0.7}
                    className="bg-white py-3.5 px-4 rounded-[14px] shadow-sm border border-border flex-row items-center justify-between"
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-text-primary font-bold text-sm" numberOfLines={1}>{t.title}</Text>
                      <Text className="text-text-secondary font-semibold text-xs mt-0.5">
                        {format(new Date(t.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#7BC67A] font-black text-base leading-none">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(t.amount))}
                      </Text>
                      <View style={{ backgroundColor: t.status === 'concluido' ? 'rgba(123, 198, 122, 0.15)' : 'rgba(240, 165, 0, 0.15)' }} className="px-2 py-0.5 rounded-full mt-1.5">
                        <Text className={`text-[8px] font-black uppercase ${t.status === 'concluido' ? 'text-[#7BC67A]' : 'text-[#F0A500]'}`}>
                          {t.status || 'concluido'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {clientTransactions.length > 5 && (
                  <TouchableOpacity className="items-center py-1.5">
                    <Text className="text-[#0D4F5C] font-bold text-xs uppercase">VER TUDO NO HISTÓRICO</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Observações */}
          {client.notes && (
            <View className="bg-surface p-4 rounded-[14px] border border-border mb-6 shadow-sm">
              <View className="flex-row items-center mb-3">
                <Ionicons name="document-text" size={18} color="#F0A500" />
                <Text className="ml-2 text-text-secondary font-bold text-[10px] uppercase tracking-wider">Notas</Text>
              </View>
              <Text className="text-text-primary font-medium text-sm leading-5">{client.notes}</Text>
            </View>
          )}

          {/* Botão Excluir */}
          <TouchableOpacity onPress={handleDelete} className="items-center mt-6 mb-20">
            <Text className="text-[#E05555] font-black text-sm uppercase tracking-wider">EXCLUIR CLIENTE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Detalhes da Transação */}
      <Modal visible={showTransactionModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[24px] p-6 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-text-primary">Detalhes</Text>
              <TouchableOpacity onPress={() => setShowTransactionModal(false)}>
                <Ionicons name="close-circle" size={32} color="#A0B0B5" />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-surface p-6 rounded-[14px] mb-4 border border-border items-center shadow-sm">
                  <View style={{ backgroundColor: selectedTransaction.status === 'concluido' ? 'rgba(123, 198, 122, 0.15)' : 'rgba(240, 165, 0, 0.15)' }} className="px-2.5 py-0.5 rounded-full mb-3">
                    <Text className={`font-black text-[8px] uppercase ${selectedTransaction.status === 'concluido' ? 'text-[#7BC67A]' : 'text-[#F0A500]'}`}>
                      {selectedTransaction.status || 'concluido'}
                    </Text>
                  </View>
                  
                  <Text className="text-2xl font-black text-text-primary text-center mb-1 leading-tight">{selectedTransaction.title}</Text>
                  <Text className="text-text-secondary font-bold text-xs uppercase mb-5">
                    {format(new Date(selectedTransaction.date + 'T12:00:00'), "eeee, dd 'de' MMMM", { locale: ptBR })}
                  </Text>

                  <View style={{ backgroundColor: 'rgba(123, 198, 122, 0.10)', borderColor: 'rgba(123, 198, 122, 0.20)' }} className="w-full p-4 rounded-[12px] flex-row items-center justify-between border">
                    <View>
                      <Text className="text-[#7BC67A] font-bold text-[10px] uppercase">Valor recebido</Text>
                      <Text className="text-[#7BC67A] font-black text-3xl leading-tight">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(selectedTransaction.amount))}
                      </Text>
                    </View>
                    <Ionicons name="cash" size={26} color="#7BC67A" />
                  </View>
                </View>

                {selectedTransaction.description && (
                  <View className="bg-surface p-4 rounded-[14px] border border-border mb-4 shadow-sm">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="document-text" size={18} color="#F0A500" />
                      <Text className="ml-2 text-text-secondary font-bold text-[10px] uppercase tracking-wider">Descrição</Text>
                    </View>
                    <Text className="text-text-primary font-medium text-sm leading-5">{selectedTransaction.description}</Text>
                  </View>
                )}

                <View className="flex-row gap-4 mb-8">
                  <View className="flex-1 bg-surface p-4 rounded-[14px] border border-border items-center shadow-sm">
                    <Ionicons name="card-outline" size={20} color="#0D4F5C" />
                    <Text className="text-text-secondary font-bold text-[9px] uppercase mt-1.5">Pagamento</Text>
                    <Text className="text-text-primary font-black text-xs uppercase mt-0.5">{selectedTransaction.payment_method || 'Pix'}</Text>
                  </View>
                  <View className="flex-1 bg-surface p-4 rounded-[14px] border border-border items-center shadow-sm">
                    <Ionicons name="pricetag-outline" size={20} color="#E05555" />
                    <Text className="text-text-secondary font-bold text-[9px] uppercase mt-1.5">Categoria</Text>
                    <Text className="text-text-primary font-black text-xs uppercase mt-0.5">{selectedTransaction.category || 'Serviço'}</Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
