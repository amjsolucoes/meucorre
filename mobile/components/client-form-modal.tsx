import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator, Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import * as z from 'zod';

import { useClients } from '@/hooks/use-clients';
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

interface ClientFormModalProps {
  visible: boolean;
  onClose: () => void;
  onClientCreated?: (client: any) => void;
}

export function ClientFormModal({ visible, onClose, onClientCreated }: ClientFormModalProps) {
  const { addClient } = useClients();
  const { showAlert } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ClientFormData>({
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

  const onSubmit = async (data: ClientFormData) => {
    try {
      setLoading(true);
      const newClient = await addClient(data);

      // Fecha o modal e seleciona o cliente imediatamente, sem depender do alerta
      reset();
      onClose();
      if (onClientCreated && newClient) {
        onClientCreated(newClient);
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: error.message || 'Não foi possível salvar o cliente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCEPChange = async () => {
    const cepValue = watch('address_zipcode');
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
    } catch {
      showAlert({
        type: 'error',
        title: 'Erro de conexão',
        message: 'Não foi possível buscar o CEP agora.'
      });
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-[20px] h-[90%] shadow-2xl">
          {/* Header */}
          <View className="flex-row justify-between items-center p-6 border-b border-[#E2E8EA]">
            <Text className="text-2xl font-black text-text-primary">Novo Cliente</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-circle" size={32} color="#A0B0B5" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            className="flex-1 px-6 pt-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="pb-6 gap-5">
              
              {/* Seção Informações Básicas */}
              <View className="gap-3">
                <Text className="text-[10px] font-extrabold text-text-secondary tracking-widest uppercase mb-1 ml-1">
                  Informações Básicas
                </Text>
                
                {/* Nome */}
                <View>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <View className={`flex-row items-center bg-surface border rounded-[14px] h-14 px-4 ${errors.name ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                        <Ionicons name="person-outline" size={20} color="#6B7F85" className="mr-3" />
                        <TextInput
                          placeholder="Nome Completo"
                          value={value}
                          onChangeText={onChange}
                          className="flex-1 text-[15px] font-semibold text-text-primary ml-3"
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                  {errors.name && <Text className="text-[#E05555] text-[11px] font-bold mt-1 ml-1.5">{errors.name.message}</Text>}
                </View>

                {/* WhatsApp / Celular */}
                <View>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <View className={`flex-row items-center bg-surface border rounded-[14px] h-14 px-4 ${errors.phone ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                        <Ionicons name="phone-portrait-outline" size={20} color="#6B7F85" className="mr-3" />
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
                          className="flex-1 text-[15px] font-semibold text-text-primary ml-3"
                          placeholderTextColor="#A0B0B5"
                          keyboardType="phone-pad"
                        />
                      </View>
                    )}
                  />
                  {errors.phone && <Text className="text-[#E05555] text-[11px] font-bold mt-1 ml-1.5">{errors.phone.message}</Text>}
                </View>

                {/* WhatsApp Toggle */}
                <View className="flex-row items-center justify-between bg-surface border border-[#E2E8EA] rounded-[14px] h-14 px-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-[10px] bg-[#25D366]/10 items-center justify-center mr-3">
                      <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                    </View>
                    <Text className="text-sm font-bold text-text-primary">Este número é WhatsApp?</Text>
                  </View>
                  <Controller
                    control={control}
                    name="is_whatsapp"
                    render={({ field: { onChange, value } }) => (
                      <TouchableOpacity 
                        onPress={() => onChange(!value)}
                        activeOpacity={0.8}
                        className={`w-12 h-7 rounded-full justify-center px-0.5 ${value ? 'bg-[#7BC67A]' : 'bg-[#D0D9DC]'}`}
                      >
                        <View className={`w-6 h-6 rounded-full bg-white shadow-sm ${value ? 'self-end' : 'self-start'}`} />
                      </TouchableOpacity>
                    )}
                  />
                </View>

                {/* Fixo */}
                <Controller
                  control={control}
                  name="phone_fixed"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center bg-surface border border-[#E2E8EA] rounded-[14px] h-14 px-4">
                      <Ionicons name="call-outline" size={20} color="#6B7F85" className="mr-3" />
                      <MaskInput
                        placeholder="Telefone Fixo (Opcional)"
                        value={value}
                        onChangeText={onChange}
                        mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        className="flex-1 text-[15px] font-semibold text-text-primary ml-3"
                        placeholderTextColor="#A0B0B5"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                />
              </View>

              {/* Seção Endereço */}
              <View className="gap-3">
                <Text className="text-[10px] font-extrabold text-text-secondary tracking-widest uppercase mb-1 ml-1">
                  Onde Mora?
                </Text>
                
                {/* CEP com Botão de Busca */}
                <View className="flex-row gap-2.5">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="address_zipcode"
                      render={({ field: { onChange, value } }) => (
                        <View className={`flex-row items-center bg-surface border rounded-[14px] h-14 px-4 ${errors.address_zipcode ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                          <Ionicons name="location-outline" size={20} color="#6B7F85" className="mr-3" />
                          <MaskInput
                            placeholder="CEP"
                            value={value}
                            onChangeText={onChange}
                            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                            className="flex-1 text-[15px] font-semibold text-text-primary ml-3"
                            placeholderTextColor="#A0B0B5"
                            keyboardType="numeric"
                          />
                        </View>
                      )}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={handleCEPChange}
                    disabled={isSearchingCEP}
                    activeOpacity={0.8}
                    className="bg-[#0D4F5C] w-14 h-14 rounded-[14px] items-center justify-center shadow-lg"
                  >
                    {isSearchingCEP ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Ionicons name="search" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.address_zipcode && <Text className="text-[#E05555] text-[11px] font-bold ml-1.5">{errors.address_zipcode.message}</Text>}

                {/* Rua */}
                <View>
                  <Controller
                    control={control}
                    name="address_street"
                    render={({ field: { onChange, value } }) => (
                      <View className={`bg-surface border rounded-[14px] h-14 px-4 justify-center ${errors.address_street ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                        <TextInput
                          placeholder="Rua / Logradouro"
                          value={value}
                          onChangeText={onChange}
                          className="text-[15px] font-semibold text-text-primary"
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                  {errors.address_street && <Text className="text-[#E05555] text-[11px] font-bold mt-1 ml-1.5">{errors.address_street.message}</Text>}
                </View>

                {/* Número e Bairro */}
                <View className="flex-row gap-2.5">
                  <View className="w-[30%]">
                    <Controller
                      control={control}
                      name="address_number"
                      render={({ field: { onChange, value } }) => (
                        <View className={`bg-surface border rounded-[14px] h-14 px-4 justify-center ${errors.address_number ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                          <TextInput
                            placeholder="Nº"
                            value={value}
                            onChangeText={onChange}
                            className="text-[15px] font-semibold text-text-primary text-center"
                            placeholderTextColor="#A0B0B5"
                          />
                        </View>
                      )}
                    />
                    {errors.address_number && <Text className="text-[#E05555] text-[10px] font-bold mt-1 text-center">Obrigatório</Text>}
                  </View>
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="address_neighborhood"
                      render={({ field: { onChange, value } }) => (
                        <View className={`bg-surface border rounded-[14px] h-14 px-4 justify-center ${errors.address_neighborhood ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                          <TextInput
                            placeholder="Bairro"
                            value={value}
                            onChangeText={onChange}
                            className="text-[15px] font-semibold text-text-primary"
                            placeholderTextColor="#A0B0B5"
                          />
                        </View>
                      )}
                    />
                    {errors.address_neighborhood && <Text className="text-[#E05555] text-[11px] font-bold mt-1 ml-1.5">{errors.address_neighborhood.message}</Text>}
                  </View>
                </View>

                {/* Cidade e UF */}
                <View className="flex-row gap-2.5">
                  <View className="flex-1">
                    <Controller
                      control={control}
                      name="address_city"
                      render={({ field: { onChange, value } }) => (
                        <View className={`bg-surface border rounded-[14px] h-14 px-4 justify-center ${errors.address_city ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                          <TextInput
                            placeholder="Cidade"
                            value={value}
                            onChangeText={onChange}
                            className="text-[15px] font-semibold text-text-primary"
                            placeholderTextColor="#A0B0B5"
                          />
                        </View>
                      )}
                    />
                  </View>
                  <View className="w-[25%]">
                    <Controller
                      control={control}
                      name="address_state"
                      render={({ field: { onChange, value } }) => (
                        <View className={`bg-surface border rounded-[14px] h-14 px-4 justify-center ${errors.address_state ? 'border-[#E05555]' : 'border-[#E2E8EA]'}`}>
                          <TextInput
                            placeholder="UF"
                            value={value}
                            onChangeText={onChange}
                            maxLength={2}
                            autoCapitalize="characters"
                            className="text-[15px] font-semibold text-text-primary text-center"
                            placeholderTextColor="#A0B0B5"
                          />
                        </View>
                      )}
                    />
                  </View>
                </View>
              </View>

              {/* Notas / Observações */}
              <View className="gap-3">
                <Text className="text-[10px] font-extrabold text-text-secondary tracking-widest uppercase mb-1 ml-1">
                  Observações (Opcional)
                </Text>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field: { onChange, value } }) => (
                    <View className="bg-surface border border-[#E2E8EA] rounded-[16px] px-4 py-3 min-h-[100px]">
                      <TextInput
                        placeholder="Ex: Cliente prefere atendimento aos sábados..."
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={4}
                        className="text-[15px] font-semibold text-text-primary"
                        placeholderTextColor="#A0B0B5"
                        textAlignVertical="top"
                      />
                    </View>
                  )}
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity 
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.85}
                className="rounded-full overflow-hidden mt-3 shadow-lg"
              >
                <LinearGradient
                  colors={loading ? ['#C5D0D3', '#C5D0D3'] : ['#0D4F5C', '#1A6B7A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-14 flex-row items-center justify-center"
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="person-add-outline" size={20} color="white" />
                      <Text className="text-white text-base font-extrabold tracking-wide">Salvar Cliente</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
