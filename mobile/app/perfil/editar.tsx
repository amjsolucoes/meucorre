import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  View, Text, TextInput, ActivityIndicator, KeyboardAvoidingView, 
  Platform, Pressable, ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MaskInput from 'react-native-mask-input';
import { useProfile } from '@/hooks/use-profile';
import { useProfessions } from '@/hooks/use-professions';
import { getFriendlyErrorMessage } from '@/lib/errors';
import { useUIStore } from '@/stores/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '@/components/screen-header';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().optional(),
  address_zipcode: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  professions: z.array(z.string()),
});

interface FormData {
  name: string;
  phone?: string;
  address_zipcode?: string;
  address_street?: string;
  address_number?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  professions: string[];
}

const getProfessionIcon = (name?: string, dbIcon?: string): any => {
  if (!name) return 'briefcase';
  const iconMap: { [key: string]: string } = {
    'bike': 'bicycle', 'car': 'car', 'package': 'cube', 'hammer': 'hammer',
    'zap': 'flash', 'paintbrush': 'brush', 'droplet': 'water', 'sparkles': 'sparkles',
    'leaf': 'leaf', 'wrench': 'build', 'shoppingbag': 'cart', 'briefcase': 'briefcase',
  };
  if (dbIcon) {
    const normalizedDbIcon = dbIcon.toLowerCase();
    if (iconMap[normalizedDbIcon]) return iconMap[normalizedDbIcon];
    return normalizedDbIcon;
  }
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

const ProfessionItem = React.memo(({ item, isSelected, onToggle }: { 
  item: any, isSelected: boolean, onToggle: (name: string) => void 
}) => {
  if (!item) return null;
  return (
    <TouchableOpacity
      onPress={() => onToggle(item.name)}
      activeOpacity={0.7}
      className={`flex-row items-center justify-between p-4 rounded-[14px] mb-3 bg-white shadow-sm ${
        isSelected ? 'bg-[#0D4F5C]/5' : ''
      }`}
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-[12px] items-center justify-center mr-3 ${
          isSelected ? 'bg-[#0D4F5C]' : 'bg-surface shadow-sm'
        }`}>
          <Ionicons 
            name={getProfessionIcon(item.name, item.icon)} 
            size={20} 
            color={isSelected ? 'white' : '#6B7F85'} 
          />
        </View>
        <Text className={`text-base font-bold ${isSelected ? 'text-[#0D4F5C]' : 'text-text-primary'}`}>
          {item.name}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={20} color="#7BC67A" />
      )}
    </TouchableOpacity>
  );
});

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { profile, loading: loadingProfile, updateProfile } = useProfile();
  const { professions: allProfessions, loading: loadingProfessions } = useProfessions();
  const { showAlert } = useUIStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showProfessionsModal, setShowProfessionsModal] = useState(false);
  const [localProfessions, setLocalProfessions] = useState<string[]>([]);
  const [professionsSearch, setProfessionsSearch] = useState('');
  const [isSearchingCEP, setIsSearchingCEP] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', professions: [], phone: '',
    }
  });

  const selectedProfessions = watch('professions') || [];
  const zipcode = watch('address_zipcode');

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        phone: profile.phone || '',
        address_zipcode: profile.address_zipcode || '',
        address_street: profile.address_street || '',
        address_number: profile.address_number || '',
        address_neighborhood: profile.address_neighborhood || '',
        address_city: profile.address_city || '',
        address_state: profile.address_state || '',
        professions: profile.professions || [],
      });
    }
  }, [profile, reset]);

  const handleCEPChange = async () => {
    if (!zipcode) return;
    const cleanCEP = zipcode.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      showAlert({ type: 'info', title: 'CEP incompleto', message: 'Digite os 8 números do CEP primeiro.' });
      return;
    }

    try {
      setIsSearchingCEP(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        showAlert({ type: 'error', title: 'CEP não encontrado', message: 'Verifique se o número está correto.' });
      } else {
        setValue('address_street', data.logradouro, { shouldDirty: true });
        setValue('address_neighborhood', data.bairro, { shouldDirty: true });
        setValue('address_city', data.localidade, { shouldDirty: true });
        setValue('address_state', data.uf, { shouldDirty: true });
      }
    } catch (error) {
      showAlert({ type: 'error', title: 'Erro de conexão', message: 'Não foi possível buscar o CEP agora.' });
    } finally {
      setIsSearchingCEP(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      await updateProfile(data);
      showAlert({ 
        type: 'success', title: 'Salvo!', message: 'Seu perfil foi atualizado.',
        onConfirm: () => router.push('/perfil')
      });
    } catch (error: any) {
      showAlert({ type: 'error', title: 'Erro', message: getFriendlyErrorMessage(error, 'Falha ao salvar.') });
    } finally {
      setIsSaving(false);
    }
  };

  const openProfessionsModal = useCallback(() => {
    setLocalProfessions([...selectedProfessions]);
    setShowProfessionsModal(true);
  }, [selectedProfessions]);

  const closeProfessionsModal = useCallback(() => {
    setShowProfessionsModal(false);
    setProfessionsSearch('');
  }, []);

  const saveProfessions = useCallback(() => {
    setValue('professions', localProfessions, { shouldDirty: true });
    closeProfessionsModal();
  }, [localProfessions, setValue, closeProfessionsModal]);

  const toggleLocalProfession = useCallback((name: string) => {
    setLocalProfessions(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  }, []);

  const filteredProfessions = useMemo(() => {
    return allProfessions.filter(p => 
      p.name.toLowerCase().includes(professionsSearch.toLowerCase())
    );
  }, [allProfessions, professionsSearch]);

  const isLoading = loadingProfile || loadingProfessions;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0D4F5C" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Editar Perfil" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 px-6 mt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="space-y-5 pb-20">
            
            {/* Nome */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">NOME COMPLETO</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-surface p-4 rounded-[10px] font-bold text-text-primary shadow-sm text-base"
                    placeholder="Seu nome"
                    value={value || ''}
                    onChangeText={onChange}
                    placeholderTextColor="#A0B0B5"
                  />
                )}
              />
              {errors.name && <Text className="text-[#E05555] text-xs mt-1 ml-1 font-bold">{errors.name.message}</Text>}
            </View>

            {/* Telefone / WhatsApp */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">WHATSAPP / CELULAR</Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <MaskInput
                    placeholder="Seu telefone"
                    value={value || ''}
                    onChangeText={(masked) => onChange(masked)}
                    mask={(text) => {
                      if (!text) return [];
                      const clean = text.replace(/\D/g, '');
                      if (clean.length <= 10) {
                        return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                      }
                      return ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
                    }}
                    className="bg-surface p-4 rounded-[10px] font-bold text-text-primary shadow-sm text-base"
                    placeholderTextColor="#A0B0B5"
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>

            {/* Profissões */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">MINHAS PROFISSÕES</Text>
              <View className="bg-surface rounded-[14px] overflow-hidden shadow-sm">
                {selectedProfessions.length > 0 ? (
                  selectedProfessions.map((prof, index) => {
                    if (!prof) return null;
                    return (
                      <View key={`sel-${prof}`} className={`flex-row items-center justify-between p-4 ${index !== 0 ? 'border-t border-divider/40' : ''}`}>
                        <View className="flex-row items-center">
                          <View className="w-9 h-9 bg-[#0D4F5C]/15 rounded-[12px] items-center justify-center mr-3">
                            <Ionicons name={getProfessionIcon(prof)} size={18} color="#0D4F5C" />
                          </View>
                          <Text className="text-text-primary font-bold text-base">{prof}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setValue('professions', selectedProfessions.filter(p => p !== prof))} activeOpacity={0.7}>
                          <Ionicons name="close-circle" size={20} color="#E05555" />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                ) : (
                  <View className="p-6 items-center">
                    <Text className="text-text-hint italic text-sm">Nenhuma profissão...</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  onPress={openProfessionsModal}
                  activeOpacity={0.7}
                  className="bg-[#0D4F5C]/10 p-4.5 items-center flex-row justify-center"
                >
                  <Ionicons name="add-circle" size={20} color="#0D4F5C" />
                  <Text className="text-[#0D4F5C] font-black uppercase text-xs tracking-wider ml-1.5">Adicionar Profissão</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Endereço */}
            <View className="mb-4">
              <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-3 ml-1">ONDE VOCÊ ATUA? (ENDEREÇO)</Text>
              
              {/* CEP */}
              <View className="flex-row mb-4">
                <View className="flex-1 mr-3">
                  <Controller
                    control={control}
                    name="address_zipcode"
                    render={({ field: { onChange, value } }) => (
                      <MaskInput
                        placeholder="CEP"
                        value={value || ''}
                        onChangeText={(masked) => onChange(masked)}
                        mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                        placeholderTextColor="#A0B0B5"
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>
                <TouchableOpacity 
                  onPress={handleCEPChange}
                  disabled={isSearchingCEP}
                  className="bg-[#0D4F5C] px-5 rounded-[12px] shadow-sm justify-center items-center"
                  style={{ minWidth: 52 }}
                  activeOpacity={0.8}
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
                    <TextInput
                      placeholder="Rua / Logradouro"
                      value={value || ''}
                      onChangeText={onChange}
                      className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                      placeholderTextColor="#A0B0B5"
                    />
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
                      <TextInput
                        placeholder="Nº"
                        value={value || ''}
                        onChangeText={onChange}
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm text-center"
                        placeholderTextColor="#A0B0B5"
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="address_neighborhood"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Bairro"
                        value={value || ''}
                        onChangeText={onChange}
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                        placeholderTextColor="#A0B0B5"
                      />
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
                      <TextInput
                        placeholder="Cidade"
                        value={value || ''}
                        onChangeText={onChange}
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm"
                        placeholderTextColor="#A0B0B5"
                      />
                    )}
                  />
                </View>
                <View className="w-[25%]">
                  <Controller
                    control={control}
                    name="address_state"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="UF"
                        value={value || ''}
                        onChangeText={onChange}
                        maxLength={2}
                        autoCapitalize="characters"
                        className="bg-surface p-4 rounded-[10px] text-base font-semibold text-text-primary shadow-sm text-center"
                        placeholderTextColor="#A0B0B5"
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)}
              disabled={isSaving}
              activeOpacity={0.8}
              className="rounded-full mt-6 mb-20 overflow-hidden shadow-lg shadow-[#0D4F5C]/20"
            >
              <LinearGradient
                colors={['#0D4F5C', '#1A6B7A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4.5 flex-row items-center justify-center"
                style={{ minHeight: 52 }}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={22} color="white" />
                    <Text className="text-white font-black text-base ml-2 uppercase">Salvar Alterações</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Customizado (Absolute View) */}
      {showProfessionsModal && (
        <View className="absolute inset-0 bg-white z-50">
          <SafeAreaView className="flex-1 px-6">
            <View className="flex-row items-center justify-between py-5">
              <Text className="text-2xl font-black text-text-primary">Profissões</Text>
              <TouchableOpacity onPress={closeProfessionsModal} className="w-[44px] h-[44px] bg-surface rounded-[12px] items-center justify-center shadow-sm" activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#6B7F85" />
              </TouchableOpacity>
            </View>

            <View className="bg-surface flex-row items-center px-4 py-3 rounded-[10px] mb-5 shadow-sm">
              <Ionicons name="search" size={20} color="#6B7F85" />
              <TextInput 
                className="flex-1 ml-3 font-semibold text-text-primary h-10"
                placeholder="Buscar profissão..."
                value={professionsSearch}
                onChangeText={setProfessionsSearch}
                placeholderTextColor="#A0B0B5"
              />
            </View>

            <FlatList
              data={filteredProfessions}
              keyExtractor={(item) => `prof-${item.id}`}
              renderItem={({ item }) => (
                <ProfessionItem 
                  item={item} 
                  isSelected={localProfessions.includes(item.name)} 
                  onToggle={toggleLocalProfession} 
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />

            <View className="absolute bottom-6 left-6 right-6">
              <TouchableOpacity 
                onPress={saveProfessions}
                activeOpacity={0.8}
                className="rounded-full overflow-hidden shadow-lg shadow-[#0D4F5C]/20"
              >
                <LinearGradient
                  colors={['#0D4F5C', '#1A6B7A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="p-4.5 items-center justify-center"
                  style={{ minHeight: 52 }}
                >
                  <Text className="text-white font-black text-base uppercase">
                    Selecionar ({localProfessions.length})
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}
