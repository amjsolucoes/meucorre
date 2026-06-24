import { AMJBranding } from '@/components/amj-branding';
import { ScreenHeader } from '@/components/screen-header';
import { useProfessions } from '@/hooks/use-professions';
import { useProfile } from '@/hooks/use-profile';
import { useAuthStore } from '@/stores/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getProfessionIcon = (name: string, dbIcon?: string): any => {
  const iconMap: { [key: string]: string } = {
    'bike': 'bicycle',
    'car': 'car',
    'package': 'cube',
    'hammer': 'hammer',
    'zap': 'flash',
    'paintbrush': 'brush',
    'droplet': 'water',
    'sparkles': 'sparkles',
    'leaf': 'leaf',
    'wrench': 'build',
    'shoppingbag': 'cart',
    'briefcase': 'briefcase',
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

export default function PerfilScreen() {
  const router = useRouter();
  const { profile, loading: loadingProfile } = useProfile();
  const { user } = useAuthStore();
  const { professions: allProfessions, loading: loadingProfessions } = useProfessions();

  const loading = loadingProfile || loadingProfessions;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#0D4F5C" size="large" />
      </View>
    );
  }

  const professions = profile?.professions || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader title="Meu Perfil" />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View className="items-center mt-6">
          <View className="relative">
            <View className="w-28 h-28 bg-[#E8F4F6] border border-border shadow-sm rounded-full items-center justify-center overflow-hidden">
              <Ionicons name="construct" size={52} color="#0D4F5C" />
            </View>
            <TouchableOpacity
              onPress={() => router.push('/perfil/editar')}
              className="absolute bottom-0 right-0 bg-[#0D4F5C] w-10 h-10 rounded-full items-center justify-center border-4 border-white shadow-md shadow-[#0D4F5C]/20"
              activeOpacity={0.8}
              accessibilityLabel="Editar perfil"
            >
              <Ionicons name="pencil" size={14} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-black text-text-primary mt-6 text-center leading-tight">
            {profile?.name || 'Guerreiro'}
          </Text>
          <Text className="text-text-secondary font-bold text-sm mt-1.5 text-center">
            {user?.email}
          </Text>
        </View>

        {/* Professions Section */}
        <View className="mt-6">
          <Text className="text-text-secondary font-bold text-[10px] uppercase tracking-wider mb-2 ml-1">Meu Corre</Text>
          <View className="bg-surface rounded-[14px] border border-border overflow-hidden shadow-sm">
            {professions.length > 0 ? (
              professions.map((prof, index) => {
                const professionData = allProfessions.find(p => p.name === prof);
                return (
                  <View key={prof} className={`flex-row items-center p-4 ${index !== 0 ? 'border-t border-divider' : ''}`}>
                    <View className="w-10 h-10 bg-[#0D4F5C]/15 rounded-[12px] items-center justify-center mr-3">
                      <Ionicons name={getProfessionIcon(prof, (professionData as any)?.icon)} size={20} color="#0D4F5C" />
                    </View>
                    <Text className="text-text-primary font-bold text-base">{prof}</Text>
                  </View>
                );
              })
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/perfil/editar')}
                className="p-8 items-center justify-center"
              >
                <Ionicons name="add-circle-outline" size={28} color="#A0B0B5" />
                <Text className="text-text-hint font-bold italic mt-2 text-center text-sm">Nenhuma profissão informada...</Text>
                <Text className="text-[#0D4F5C] font-black mt-1 uppercase text-sm tracking-tight">Adicionar agora</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Details Card */}
        <View className="mt-6 mb-6 bg-surface rounded-[14px] p-4 shadow-sm border border-border">
          <View className="space-y-4">

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-[#0D4F5C]/15 rounded-[12px] items-center justify-center mr-3">
                <Ionicons name="phone-portrait-outline" size={20} color="#0D4F5C" />
              </View>
              <View className="flex-1">
                <Text className="text-text-secondary font-bold text-[9px] uppercase tracking-wider">Telefone</Text>
                <Text className="text-text-primary font-black text-base mt-0.5">{profile?.phone || 'Não informado'}</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-[#F0A500]/15 rounded-[12px] items-center justify-center mr-3">
                <Ionicons name="location-outline" size={20} color="#F0A500" />
              </View>
              <View className="flex-1">
                <Text className="text-text-secondary font-bold text-[9px] uppercase tracking-wider">Endereço</Text>
                <Text className="text-text-primary font-black text-base mt-0.5 leading-tight" numberOfLines={3}>
                  {profile?.address_street
                    ? `${profile.address_street}, ${profile.address_number}\n${profile.address_neighborhood}\n${profile.address_city}/${profile.address_state}`
                    : 'Não informado'
                  }
                </Text>
              </View>
            </View>

          </View>
        </View>

        {/* Brand attribution signature */}
        <AMJBranding />

      </ScrollView>
    </SafeAreaView>
  );
}

