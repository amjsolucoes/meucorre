import { ScreenHeader } from '@/components/screen-header';
import { Theme } from '@/constants/theme';
import { useClients } from '@/hooks/use-clients';
import { usePagination } from '@/hooks/use-pagination';
import { openWhatsApp } from '@/lib/whatsapp';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATAR_COLORS = ['#0D4F5C', '#1A6B7A', '#7BC67A', '#F0A500', '#E05555'];
const getClientColor = (index: number) => AVATAR_COLORS[index % AVATAR_COLORS.length];
const getClientInitial = (name: string) => name.charAt(0).toUpperCase();

type Client = {
  id: string;
  name: string;
  phone: string;
  phone_fixed?: string;
  is_whatsapp: boolean;
  address_city?: string;
  address_neighborhood?: string;
};

export default function ClientesScreen() {
  const router = useRouter();
  const { clients, loading, fetchClients } = useClients();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Recarrega os clientes toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      fetchClients();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.phone?.includes(search)
  );

  const { visibleData, hasMore, loadMore } = usePagination(filteredClients, 20, search);

  const handleContactPress = (client: Client) => {
    setSelectedClient(client);
    setContactModalVisible(true);
  };

  const handleCall = (phoneNumber: string) => {
    setContactModalVisible(false);
    Linking.openURL(`tel:${phoneNumber.replace(/\D/g, '')}`);
  };

  const handleWhatsApp = (phoneNumber: string) => {
    setContactModalVisible(false);
    openWhatsApp(phoneNumber);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View style={{ flex: 1 }}>
        <ScreenHeader
          title="Meus Clientes"
          showBackButton={false}
          rightElement={
            <TouchableOpacity
              onPress={() => router.push('/importar-contatos')}
              style={{
                width: 42, height: 42, borderRadius: 13,
                backgroundColor: '#E8F4F6',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: '#C8E0E5',
              }}
              accessibilityLabel="Importar contatos do celular"
              accessibilityRole="button"
            >
              <Ionicons name="download-outline" size={20} color="#0D4F5C" />
            </TouchableOpacity>
          }
        />

        <FlatList
          data={visibleData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Theme.colors.primary}
            />
          }
          ListHeaderComponent={() => (
            <>
              {/* Barra de Busca */}
              <View className="mt-6 mb-4">
                <View className="bg-surface flex-row items-center px-4 py-3.5 rounded-[10px] shadow-sm">
                  <Ionicons name="search-outline" size={20} color="#6B7F85" />
                  <TextInput
                    placeholder="Buscar pelo nome ou telefone..."
                    value={search}
                    onChangeText={setSearch}
                    className="flex-1 ml-3 text-base font-medium text-text-primary"
                    placeholderTextColor="#A0B0B5"
                    accessibilityLabel="Campo de busca de clientes"
                    accessibilityHint="Digite o nome ou telefone para filtrar a lista"
                    returnKeyType="search"
                  />
                  {search.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearch('')}
                      accessibilityLabel="Limpar busca"
                      accessibilityRole="button"
                    >
                      <Ionicons name="close-circle" size={20} color="#A0B0B5" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {loading && !refreshing && (
                <ActivityIndicator color={Theme.colors.primary} className="mt-10" />
              )}
            </>
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-[14px] mb-3 shadow-sm flex-row items-center"
              activeOpacity={0.8}
              onPress={() => router.push(`/cliente/${item.id}`)}
              accessibilityLabel={`Cliente ${item.name}, telefone ${item.phone}. Toque para ver detalhes`}
              accessibilityRole="button"
            >
              <View
                className="w-12 h-12 rounded-[12px] items-center justify-center mr-3.5"
                style={{ backgroundColor: getClientColor(index) + '15' }}
                accessible={false}
              >
                <Text className="font-black text-lg" style={{ color: getClientColor(index) }}>
                  {getClientInitial(item.name)}
                </Text>
              </View>

              <View className="flex-1 mr-2">
                <Text className="text-text-primary font-bold text-lg leading-tight" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-text-secondary font-semibold text-xs mt-0.5">{item.phone}</Text>
                {item.address_city && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location-outline" size={12} color="#6B7F85" />
                    <Text className="text-text-secondary text-xs ml-1 font-medium">
                      {item.address_neighborhood ? `${item.address_neighborhood}, ` : ''}{item.address_city}
                    </Text>
                  </View>
                )}
              </View>

              {/* Botão único de contato */}
              <TouchableOpacity
                className="bg-primary/10 p-3 rounded-[12px]"
                onPress={(e) => {
                  e.stopPropagation();
                  handleContactPress(item);
                }}
                accessibilityLabel={`Entrar em contato com ${item.name}`}
                accessibilityRole="button"
                style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#0D4F5C" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            hasMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#0D4F5C" />
              </View>
            ) : null
          }
          ListEmptyComponent={() => !loading ? (
            <View className="items-center justify-center mt-10">
              <View className="bg-surface/50 p-8 rounded-[14px] shadow-sm items-center w-full">
                <Ionicons name="people-outline" size={64} color="#A0B0B5" />
                <Text className="text-text-secondary font-black text-lg mt-4 text-center leading-tight">
                  {search ? 'Nenhum cliente encontrado' : 'Você ainda não tem\nclientes cadastrados'}
                </Text>
                {!search && (
                  <TouchableOpacity
                    onPress={() => router.push('/cliente/novo')}
                    className="mt-6 bg-primary px-6 py-3 rounded-full"
                    accessibilityLabel="Adicionar primeiro cliente"
                    accessibilityRole="button"
                  >
                    <Text className="text-white font-bold text-sm uppercase">ADICIONAR PRIMEIRO</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : null}
        />
      </View>

      {/* Modal de Opções de Contato */}
      <Modal
        visible={contactModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setContactModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-[20px] w-full max-w-sm p-6 shadow-2xl"
          >
            <Text className="text-text-primary font-black text-xl mb-2 text-center">
              Como quer falar?
            </Text>
            <Text className="text-text-secondary font-semibold text-sm mb-6 text-center">
              {selectedClient?.name}
            </Text>

            <View className="gap-3">
              {/* Telefone Principal */}
              <TouchableOpacity
                onPress={() => handleCall(selectedClient?.phone || '')}
                className="bg-primary/10 p-4 rounded-[14px] flex-row items-center"
                activeOpacity={0.7}
                accessibilityLabel={`Ligar para ${selectedClient?.phone}`}
                accessibilityRole="button"
              >
                <View className="bg-primary w-12 h-12 rounded-[12px] items-center justify-center mr-4">
                  <Ionicons name="call" size={22} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base">Ligar</Text>
                  <Text className="text-text-secondary font-semibold text-xs mt-0.5">
                    {selectedClient?.phone}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* WhatsApp */}
              {selectedClient?.is_whatsapp && (
                <TouchableOpacity
                  onPress={() => handleWhatsApp(selectedClient?.phone || '')}
                  className="bg-[#7BC67A]/10 p-4 rounded-[14px] flex-row items-center"
                  activeOpacity={0.7}
                  accessibilityLabel={`Chamar no WhatsApp ${selectedClient?.phone}`}
                  accessibilityRole="button"
                >
                  <View className="bg-[#7BC67A] w-12 h-12 rounded-[12px] items-center justify-center mr-4">
                    <Ionicons name="logo-whatsapp" size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base">WhatsApp</Text>
                    <Text className="text-text-secondary font-semibold text-xs mt-0.5">
                      {selectedClient?.phone}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Telefone Fixo */}
              {selectedClient?.phone_fixed && (
                <TouchableOpacity
                  onPress={() => handleCall(selectedClient?.phone_fixed || '')}
                  className="bg-primary/10 p-4 rounded-[14px] flex-row items-center"
                  activeOpacity={0.7}
                  accessibilityLabel={`Ligar para telefone fixo ${selectedClient?.phone_fixed}`}
                  accessibilityRole="button"
                >
                  <View className="bg-primary w-12 h-12 rounded-[12px] items-center justify-center mr-4">
                    <Ionicons name="call-outline" size={22} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base">Telefone Fixo</Text>
                    <Text className="text-text-secondary font-semibold text-xs mt-0.5">
                      {selectedClient?.phone_fixed}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Botão Cancelar */}
            <TouchableOpacity
              onPress={() => setContactModalVisible(false)}
              className="mt-4 p-4 rounded-[14px] items-center"
              activeOpacity={0.7}
              accessibilityLabel="Cancelar"
              accessibilityRole="button"
            >
              <Text className="text-text-secondary font-bold text-base">Cancelar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* FAB — Adicionar Cliente */}
      <TouchableOpacity
        onPress={() => router.push('/cliente/novo')}
        activeOpacity={0.85}
        accessibilityLabel="Adicionar novo cliente"
        accessibilityRole="button"
        style={{
          position: 'absolute',
          bottom: 110,
          right: 28,
          width: 62,
          height: 62,
          borderRadius: 31,
          backgroundColor: '#0D4F5C',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#0D4F5C',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        <Ionicons name="person-add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
