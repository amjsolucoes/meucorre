import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator, KeyboardAvoidingView, Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { ScreenHeader } from '@/components/screen-header';
import { Client, useClients } from '@/hooks/use-clients';
import { useUIStore } from '@/stores/ui';

const clientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 letras'),
  phone: z.string().min(10, 'WhatsApp inválido'),
  phone_fixed: z.string().optional(),
  address_zipcode: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  is_whatsapp: z.boolean(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function EditarClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const { clients, updateClient } = useClients();
  const { showAlert } = useUIStore();
  
  const [loading, setLoading] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      phone: '',
      phone_fixed: '',
      address_zipcode: '',
      address_street: '',
      address_number: '',
      address_neighborhood: '',
      address_city: '',
      address_state: '',
      is_whatsapp: true,
      notes: '',
    }
  });

  useEffect(() => {
    const foundClient = clients.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      reset({
        name: foundClient.name,
        phone: foundClient.phone,
        phone_fixed: foundClient.phone_fixed || '',
        address_zipcode: foundClient.address_zipcode || '',
        address_street: foundClient.address_street || '',
        address_number: foundClient.address_number || '',
        address_neighborhood: foundClient.address_neighborhood || '',
        address_city: foundClient.address_city || '',
        address_state: foundClient.address_state || '',
        is_whatsapp: foundClient.is_whatsapp ?? true,
        notes: foundClient.notes || '',
      });
    }
  }, [clientId, clients, reset]);

  const handleCEPChange = async () => {
    const cepValue = getValues('address_zipcode');
    const cleanCEP = (cepValue || '').replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      showAlert({
        type: 'info',
        title: 'CEP incompleto',
        message: 'Digite os 8 números do CEP primeiro.'
      });
      return;
    }

    try {
      setIsSearchingCEP(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        showAlert({
          type: 'error',
          title: 'CEP não encontrado',
          message: 'Verifique se o número está correto.'
        });
      } else {
        setValue('address_street', data.logradouro);
        setValue('address_neighborhood', data.bairro);
        setValue('address_city', data.localidade);
        setValue('address_state', data.uf);
      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível buscar o CEP agora.'
      });
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true);
      await updateClient(clientId, data);
      showAlert({
        type: 'success',
        title: 'Cliente Atualizado!',
        message: 'As alterações foram salvas com sucesso.',
        onConfirm: () => router.back()
      });
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: error.message || 'Não foi possível atualizar o cliente.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0D4F5C" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Editar Cliente" showBackButton={true} />
      
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
          <View className="pb-24">
            
            {/* Seção 1: Dados Básicos */}
            <Text className="text-text-secondary font-black text-[10px] uppercase tracking-[2px] mb-4 ml-1">Dados Básicos</Text>
            
            {/* Campo Nome */}
            <View className="mb-4">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextInput 
                      placeholder="Nome completo" 
                      value={value} 
                      onChangeText={onChange} 
                      className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                      placeholderTextColor="#A0B0B5"
                      accessibilityLabel="Nome do cliente"
                      accessibilityHint="Digite o nome completo do cliente"
                    />
                    {errors.name && (
                      <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Campo WhatsApp */}
            <View className="mb-4">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <MaskInput 
                      placeholder="WhatsApp ou Celular" 
                      value={value} 
                      onChangeText={onChange} 
                      mask={(text) => {
                        const clean = (text || '').replace(/\D/g, '');
                        if (clean.length <= 10) {
                          return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                        }
                        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                      }}
                      className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                      keyboardType="phone-pad" 
                      placeholderTextColor="#A0B0B5"
                      accessibilityLabel="WhatsApp do cliente"
                      accessibilityHint="Digite o celular com DDD"
                    />
                    {errors.phone && (
                      <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.phone.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* WhatsApp Toggle */}
            <View className="flex-row items-center justify-between bg-surface p-4 rounded-[14px] border border-border mb-4 shadow-sm">
              <View className="flex-row items-center">
                <View style={{ backgroundColor: 'rgba(123, 198, 122, 0.15)' }} className="w-10 h-10 rounded-full items-center justify-center">
                  <Ionicons name="logo-whatsapp" size={18} color="#7BC67A" />
                </View>
                <Text className="ml-3 text-text-primary font-bold text-base">É WhatsApp?</Text>
              </View>
              <Controller
                control={control}
                name="is_whatsapp"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity 
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                    className="w-12 h-7 rounded-full justify-center px-0.5"
                    style={{ backgroundColor: value ? '#7BC67A' : '#C5D0D3' }}
                    accessibilityLabel="Toggle se o celular possui WhatsApp"
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: value }}
                  >
                    <View className={`w-5 h-5 rounded-full bg-white shadow-sm ${value ? 'self-end' : 'self-start'}`} />
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Campo Telefone Fixo */}
            <View className="mb-4">
              <Controller
                control={control}
                name="phone_fixed"
                render={({ field: { onChange, value } }) => (
                  <MaskInput 
                    placeholder="Telefone Fixo (opcional)" 
                    value={value} 
                    onChangeText={onChange} 
                    mask={(text) => {
                      const clean = (text || '').replace(/\D/g, '');
                      if (clean.length <= 10) {
                        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                      }
                      return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                    }}
                    className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                    keyboardType="phone-pad" 
                    placeholderTextColor="#A0B0B5"
                    accessibilityLabel="Telefone fixo"
                    accessibilityHint="Digite o telefone fixo com DDD"
                  />
                )}
              />
            </View>

            {/* Seção 2: Endereço */}
            <Text className="text-text-secondary font-black text-[10px] uppercase tracking-[2px] mt-6 mb-4 ml-1">Endereço</Text>

            {/* CEP com Busca */}
            <View className="mb-4 flex-row">
              <View className="flex-1 mr-3">
                <Controller
                  control={control}
                  name="address_zipcode"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <MaskInput
                        placeholder="CEP"
                        value={value}
                        onChangeText={onChange}
                        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                        className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm"
                        placeholderTextColor="#A0B0B5"
                        keyboardType="numeric"
                        accessibilityLabel="CEP do endereço"
                        accessibilityHint="Digite o CEP com 8 dígitos"
                      />
                      {errors.address_zipcode && (
                        <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_zipcode.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
              <TouchableOpacity 
                onPress={handleCEPChange}
                disabled={isSearchingCEP}
                className="bg-[#0D4F5C] px-5 rounded-[12px] shadow-sm justify-center items-center"
                style={{ minWidth: 52, height: 52 }}
                accessibilityLabel="Buscar CEP"
                accessibilityRole="button"
              >
                {isSearchingCEP ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="search" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>

            {/* Rua */}
            <View className="mb-4">
              <Controller
                control={control}
                name="address_street"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TextInput 
                      placeholder="Nome da rua / logradouro" 
                      value={value} 
                      onChangeText={onChange} 
                      className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                      placeholderTextColor="#A0B0B5"
                      accessibilityLabel="Nome da rua"
                    />
                    {errors.address_street && (
                      <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_street.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Número e Bairro */}
            <View className="flex-row mb-4">
              <View className="w-[30%] mr-3">
                <Controller
                  control={control}
                  name="address_number"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        placeholder="Nº" 
                        value={value} 
                        onChangeText={onChange} 
                        className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary text-center shadow-sm" 
                        placeholderTextColor="#A0B0B5"
                        accessibilityLabel="Número da casa ou comércio"
                        keyboardType="numeric"
                      />
                      {errors.address_number && (
                        <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_number.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
              <View className="flex-1">
                <Controller
                  control={control}
                  name="address_neighborhood"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        placeholder="Bairro" 
                        value={value} 
                        onChangeText={onChange} 
                        className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                        placeholderTextColor="#A0B0B5"
                        accessibilityLabel="Bairro"
                      />
                      {errors.address_neighborhood && (
                        <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_neighborhood.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Cidade e UF */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-3">
                <Controller
                  control={control}
                  name="address_city"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        placeholder="Cidade" 
                        value={value} 
                        onChangeText={onChange} 
                        className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm" 
                        placeholderTextColor="#A0B0B5"
                        accessibilityLabel="Cidade"
                      />
                      {errors.address_city && (
                        <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_city.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
              <View className="w-[25%]">
                <Controller
                  control={control}
                  name="address_state"
                  render={({ field: { onChange, value } }) => (
                    <View>
                      <TextInput 
                        placeholder="UF" 
                        value={value} 
                        onChangeText={onChange} 
                        maxLength={2}
                        autoCapitalize="characters"
                        className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary text-center shadow-sm" 
                        placeholderTextColor="#A0B0B5"
                        accessibilityLabel="Estado (UF)"
                      />
                      {errors.address_state && (
                        <Text className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.address_state.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Seção 3: Notas */}
            <Text className="text-text-secondary font-black text-[10px] uppercase tracking-[2px] mt-6 mb-4 ml-1">Observações do Cliente</Text>
            <View className="mb-8">
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput 
                    placeholder="Notas ou observações importantes sobre o cliente..." 
                    value={value} 
                    onChangeText={onChange} 
                    multiline={true}
                    numberOfLines={4}
                    className="bg-surface p-4 rounded-[12px] border border-border text-base font-semibold text-text-primary shadow-sm text-left" 
                    placeholderTextColor="#A0B0B5"
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                    accessibilityLabel="Notas adicionais"
                  />
                )}
              />
            </View>

            {/* Botões de Ação */}
            <View className="flex-row gap-4">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="flex-1 bg-surface p-4.5 rounded-full border border-border" 
                activeOpacity={0.7}
                style={{ height: 52, justifyContent: 'center' }}
                accessibilityLabel="Cancelar e voltar"
                accessibilityRole="button"
              >
                <Text className="text-text-secondary font-black text-center text-sm uppercase">CANCELAR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleSubmit(onSubmit)} 
                disabled={loading}
                className="flex-[2] bg-[#0D4F5C] rounded-full shadow-lg" 
                activeOpacity={0.8}
                style={{ height: 52, justifyContent: 'center' }}
                accessibilityLabel="Salvar alterações"
                accessibilityRole="button"
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-black text-center text-sm uppercase">SALVAR ALTERAÇÕES</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
