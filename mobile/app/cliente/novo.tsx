import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useClients } from '@/hooks/use-clients';
import { getFriendlyErrorMessage } from '@/lib/errors';
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

export default function NovoClienteScreen() {
  const router = useRouter();
  const { addClient } = useClients();
  const { showAlert } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ClientFormData>({
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
      await addClient(data);
      
      showAlert({
        type: 'success',
        title: 'Cliente Salvo!',
        message: `${data.name.split(' ')[0]} foi adicionado com sucesso.`,
        onConfirm: () => router.back()
      });
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Erro ao salvar',
        message: getFriendlyErrorMessage(error, 'Não foi possível salvar o cliente.')
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <ScreenHeader title="Novo Cliente" subtitle="Cadastre seus contatos" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20, marginTop: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingBottom: 60, gap: 20 }}>
            
            {/* Seção Informações Básicas */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#6B7F85', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginLeft: 4 }}>
                Informações Básicas
              </Text>
              
              {/* Nome */}
              <View>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7F8',
                      borderWidth: 1, borderColor: errors.name ? '#E05555' : '#E2E8EA',
                      borderRadius: 14, height: 56, paddingHorizontal: 16
                    }}>
                      <Ionicons name="person-outline" size={20} color="#6B7F85" style={{ marginRight: 12 }} />
                      <TextInput
                        placeholder="Nome Completo"
                        value={value}
                        onChangeText={onChange}
                        style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                        placeholderTextColor="#A0B0B5"
                      />
                    </View>
                  )}
                />
                {errors.name && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '700', marginTop: 4, marginLeft: 6 }}>{errors.name.message}</Text>}
              </View>

              {/* WhatsApp / Celular */}
              <View>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7F8',
                      borderWidth: 1, borderColor: errors.phone ? '#E05555' : '#E2E8EA',
                      borderRadius: 14, height: 56, paddingHorizontal: 16
                    }}>
                      <Ionicons name="phone-portrait-outline" size={20} color="#6B7F85" style={{ marginRight: 12 }} />
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
                        style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                        placeholderTextColor="#A0B0B5"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                />
                {errors.phone && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '700', marginTop: 4, marginLeft: 6 }}>{errors.phone.message}</Text>}
              </View>

              {/* WhatsApp Toggle Switch */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: '#E2E8EA',
                borderRadius: 14, height: 56, paddingHorizontal: 16
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(37, 211, 102, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A1A1A' }}>Este número é WhatsApp?</Text>
                </View>
                <Controller
                  control={control}
                  name="is_whatsapp"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity 
                      onPress={() => onChange(!value)}
                      activeOpacity={0.8}
                      style={{
                        width: 50, height: 28, borderRadius: 15,
                        backgroundColor: value ? '#7BC67A' : '#D0D9DC',
                        justifyContent: 'center', paddingHorizontal: 2
                      }}
                    >
                      <View style={{
                        width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFFFF',
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
                        alignSelf: value ? 'flex-end' : 'flex-start'
                      }} />
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Fixo */}
              <View>
                <Controller
                  control={control}
                  name="phone_fixed"
                  render={({ field: { onChange, value } }) => (
                    <View style={{
                      flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7F8',
                      borderWidth: 1, borderColor: '#E2E8EA',
                      borderRadius: 14, height: 56, paddingHorizontal: 16
                    }}>
                      <Ionicons name="call-outline" size={20} color="#6B7F85" style={{ marginRight: 12 }} />
                      <MaskInput
                        placeholder="Telefone Fixo (Opcional)"
                        value={value}
                        onChangeText={onChange}
                        mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                        placeholderTextColor="#A0B0B5"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Seção Endereço */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#6B7F85', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginLeft: 4 }}>
                Onde Mora?
              </Text>
              
              {/* CEP com Botão de Busca */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name="address_zipcode"
                    render={({ field: { onChange, value } }) => (
                      <View style={{
                        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7F8',
                        borderWidth: 1, borderColor: errors.address_zipcode ? '#E05555' : '#E2E8EA',
                        borderRadius: 14, height: 56, paddingHorizontal: 16
                      }}>
                        <Ionicons name="location-outline" size={20} color="#6B7F85" style={{ marginRight: 12 }} />
                        <MaskInput
                          placeholder="CEP"
                          value={value}
                          onChangeText={onChange}
                          mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                          style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
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
                  style={{
                    backgroundColor: '#0D4F5C', width: 56, height: 56,
                    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                    shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
                  }}
                >
                  {isSearchingCEP ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Ionicons name="search" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.address_zipcode && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '700', marginLeft: 6 }}>{errors.address_zipcode.message}</Text>}

              {/* Rua */}
              <View>
                <Controller
                  control={control}
                  name="address_street"
                  render={({ field: { onChange, value } }) => (
                    <View style={{
                      backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: errors.address_street ? '#E05555' : '#E2E8EA',
                      borderRadius: 14, height: 56, paddingHorizontal: 16, justifyContent: 'center'
                    }}>
                      <TextInput
                        placeholder="Rua / Logradouro"
                        value={value}
                        onChangeText={onChange}
                        style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                        placeholderTextColor="#A0B0B5"
                      />
                    </View>
                  )}
                />
                {errors.address_street && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '700', marginTop: 4, marginLeft: 6 }}>{errors.address_street.message}</Text>}
              </View>

              {/* Número e Bairro */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ width: '30%' }}>
                  <Controller
                    control={control}
                    name="address_number"
                    render={({ field: { onChange, value } }) => (
                      <View style={{
                        backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: errors.address_number ? '#E05555' : '#E2E8EA',
                        borderRadius: 14, height: 56, paddingHorizontal: 16, justifyContent: 'center'
                      }}>
                        <TextInput
                          placeholder="Nº"
                          value={value}
                          onChangeText={onChange}
                          style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' }}
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                  {errors.address_number && <Text style={{ color: '#E05555', fontSize: 10, fontWeight: '700', marginTop: 4, textAlign: 'center' }}>Obrigatório</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name="address_neighborhood"
                    render={({ field: { onChange, value } }) => (
                      <View style={{
                        backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: errors.address_neighborhood ? '#E05555' : '#E2E8EA',
                        borderRadius: 14, height: 56, paddingHorizontal: 16, justifyContent: 'center'
                      }}>
                        <TextInput
                          placeholder="Bairro"
                          value={value}
                          onChangeText={onChange}
                          style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                  {errors.address_neighborhood && <Text style={{ color: '#E05555', fontSize: 11, fontWeight: '700', marginTop: 4, marginLeft: 6 }}>{errors.address_neighborhood.message}</Text>}
                </View>
              </View>

              {/* Cidade e UF */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name="address_city"
                    render={({ field: { onChange, value } }) => (
                      <View style={{
                        backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: errors.address_city ? '#E05555' : '#E2E8EA',
                        borderRadius: 14, height: 56, paddingHorizontal: 16, justifyContent: 'center'
                      }}>
                        <TextInput
                          placeholder="Cidade"
                          value={value}
                          onChangeText={onChange}
                          style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A' }}
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                </View>
                <View style={{ width: '25%' }}>
                  <Controller
                    control={control}
                    name="address_state"
                    render={({ field: { onChange, value } }) => (
                      <View style={{
                        backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: errors.address_state ? '#E05555' : '#E2E8EA',
                        borderRadius: 14, height: 56, paddingHorizontal: 16, justifyContent: 'center'
                      }}>
                        <TextInput
                          placeholder="UF"
                          value={value}
                          onChangeText={onChange}
                          maxLength={2}
                          autoCapitalize="characters"
                          style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' }}
                          placeholderTextColor="#A0B0B5"
                        />
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>

            {/* Notas / Observações */}
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#6B7F85', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, marginLeft: 4 }}>
                Observações (Opcional)
              </Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <View style={{
                    backgroundColor: '#F5F7F8', borderWidth: 1, borderColor: '#E2E8EA',
                    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, minHeight: 100
                  }}>
                    <TextInput
                      placeholder="Ex: Cliente prefere atendimento aos sábados ou de manhã..."
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                      style={{ fontSize: 15, fontWeight: '600', color: '#1A1A1A', textAlignVertical: 'top' }}
                      placeholderTextColor="#A0B0B5"
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
              style={{
                borderRadius: 999, overflow: 'hidden', marginTop: 12,
                shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8
              }}
            >
              <LinearGradient
                colors={loading ? ['#C5D0D3', '#C5D0D3'] : ['#0D4F5C', '#1A6B7A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="person-add-outline" size={20} color="white" />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }}>Salvar Cliente</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
