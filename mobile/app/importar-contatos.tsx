import { useClients } from '@/hooks/use-clients';
import { PhoneContact, useContacts } from '@/hooks/use-contacts';
import { usePagination } from '@/hooks/use-pagination';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImportarContatosScreen() {
  const { contacts, loading, requestAndLoad } = useContacts();
  const { addClient, clients } = useClients();
  const { showAlert } = useUIStore();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // IDs de clientes já cadastrados (para evitar duplicatas)
  const existingPhones = new Set(
    clients.map((c) => c.phone.replace(/\D/g, ''))
  );

  const handleLoad = async () => {
    const result = await requestAndLoad();
    if (result === 'granted') {
      setLoaded(true);
    } else if (result === 'denied') {
      showAlert({
        type: 'error',
        title: 'Permissão negada',
        message: 'Para importar contatos, permita o acesso nas configurações do celular.',
        confirmText: 'ABRIR CONFIGURAÇÕES',
        showCancel: true,
        cancelText: 'AGORA NÃO',
        onConfirm: () => Linking.openSettings(),
      });
    } else {
      showAlert({
        type: 'error',
        title: 'Não foi possível',
        message: 'Não conseguimos acessar seus contatos. Tente novamente.',
      });
    }
  };

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => {
    const ids = filteredContacts
      .filter((c) => !existingPhones.has(c.phone.replace(/\D/g, '')))
      .map((c) => c.id);
    setSelected(new Set(ids));
  };

  const clearSelection = () => setSelected(new Set());

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const { visibleData, hasMore, loadMore } = usePagination(filteredContacts, 30, search);

  const handleImport = async () => {
    if (selected.size === 0) return;

    setImporting(true);
    let success = 0;
    let skipped = 0;

    try {
      const toImport = contacts.filter((c) => selected.has(c.id));

      for (const contact of toImport) {
        const cleanPhone = contact.phone.replace(/\D/g, '');
        if (existingPhones.has(cleanPhone)) {
          skipped++;
          continue;
        }
        try {
          await addClient({
            name: contact.name,
            phone: contact.phone,
            is_whatsapp: contact.isWhatsApp,
          });
          success++;
        } catch {
          skipped++;
        }
      }

      showAlert({
        type: 'success',
        title: 'Importação concluída!',
        message:
          skipped > 0
            ? `${success} cliente(s) importado(s). ${skipped} já existiam ou falharam.`
            : `${success} cliente(s) importado(s) com sucesso!`,
        onConfirm: () => router.back(),
      });
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Erro na importação',
        message: 'Não foi possível importar os contatos. Tente novamente.',
      });
    } finally {
      setImporting(false);
    }
  };

  const isAlreadyAdded = (contact: PhoneContact) =>
    existingPhones.has(contact.phone.replace(/\D/g, ''));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFB' }} edges={['top']}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8EA',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: '#F0F4F5',
            alignItems: 'center', justifyContent: 'center',
          }}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color="#0D4F5C" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0D4F5C' }}>
            Importar Contatos
          </Text>
          {loaded && contacts.length > 0 && (
            <Text style={{ fontSize: 12, color: '#6B7F85', fontWeight: '500', marginTop: 1 }}>
              {contacts.length} contatos encontrados
            </Text>
          )}
        </View>

        {/* Botão importar */}
        {selected.size > 0 && (
          <TouchableOpacity
            onPress={handleImport}
            disabled={importing}
            style={{
              backgroundColor: '#0D4F5C',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            accessibilityLabel={`Importar ${selected.size} contatos`}
            accessibilityRole="button"
          >
            {importing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
                  {selected.size}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Estado inicial — ainda não carregou */}
      {!loaded && !loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: '#E8F4F6',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Ionicons name="people-outline" size={40} color="#0D4F5C" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#1A1A1A', textAlign: 'center' }}>
            Importe seus clientes
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7F85', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
            Acesse sua agenda de contatos e escolha quais pessoas adicionar como clientes no app.
          </Text>
          <TouchableOpacity
            onPress={handleLoad}
            style={{
              marginTop: 32,
              backgroundColor: '#0D4F5C',
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 999,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
            accessibilityLabel="Acessar contatos do celular"
            accessibilityRole="button"
          >
            <Ionicons name="phone-portrait-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
              Acessar Contatos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ActivityIndicator size="large" color="#0D4F5C" />
          <Text style={{ color: '#6B7F85', fontWeight: '600' }}>Carregando contatos...</Text>
        </View>
      )}

      {/* Lista de contatos */}
      {loaded && !loading && (
        <>
          {/* Barra de busca + ações */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, backgroundColor: '#F8FAFB' }}>
            <View
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#FFFFFF', borderRadius: 14,
                borderWidth: 1, borderColor: '#E2E8EA',
                paddingHorizontal: 14, height: 48, marginBottom: 10,
              }}
            >
              <Ionicons name="search-outline" size={18} color="#A0B0B5" />
              <TextInput
                placeholder="Buscar contato..."
                value={search}
                onChangeText={setSearch}
                style={{ flex: 1, marginLeft: 10, fontSize: 15, color: '#1A1A1A' }}
                placeholderTextColor="#A0B0B5"
                accessibilityLabel="Buscar contato"
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel="Limpar busca">
                  <Ionicons name="close-circle" size={18} color="#A0B0B5" />
                </TouchableOpacity>
              )}
            </View>

            {/* Selecionar todos / limpar */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={selectAll}
                style={{
                  flex: 1, paddingVertical: 8, borderRadius: 10,
                  backgroundColor: '#E8F4F6', alignItems: 'center',
                }}
                accessibilityLabel="Selecionar todos"
                accessibilityRole="button"
              >
                <Text style={{ color: '#0D4F5C', fontWeight: '700', fontSize: 12 }}>
                  Selecionar todos
                </Text>
              </TouchableOpacity>
              {selected.size > 0 && (
                <TouchableOpacity
                  onPress={clearSelection}
                  style={{
                    flex: 1, paddingVertical: 8, borderRadius: 10,
                    backgroundColor: '#FFF0F0', alignItems: 'center',
                  }}
                  accessibilityLabel="Limpar seleção"
                  accessibilityRole="button"
                >
                  <Text style={{ color: '#E05555', fontWeight: '700', fontSize: 12 }}>
                    Limpar seleção
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            data={visibleData}
            keyExtractor={(item) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 }}
            ListFooterComponent={
              hasMore ? (
                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#0D4F5C" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Ionicons name="search-outline" size={48} color="#C5D0D3" />
                <Text style={{ color: '#6B7F85', fontWeight: '700', marginTop: 12 }}>
                  Nenhum contato encontrado
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const already = isAlreadyAdded(item);
              const isSelected = selected.has(item.id);

              return (
                <TouchableOpacity
                  onPress={() => !already && toggleSelect(item.id)}
                  activeOpacity={already ? 1 : 0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 8,
                    borderWidth: isSelected ? 1.5 : 1,
                    borderColor: isSelected ? '#0D4F5C' : '#E2E8EA',
                    opacity: already ? 0.5 : 1,
                  }}
                  accessibilityLabel={`${item.name}, ${item.phone}${already ? ', já cadastrado' : ''}`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected, disabled: already }}
                >
                  {/* Avatar */}
                  <View
                    style={{
                      width: 44, height: 44, borderRadius: 22,
                      backgroundColor: isSelected ? '#0D4F5C' : '#E8F4F6',
                      alignItems: 'center', justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={22} color="#fff" />
                    ) : (
                      <Text style={{ fontSize: 18, fontWeight: '900', color: '#0D4F5C' }}>
                        {item.name[0].toUpperCase()}
                      </Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6B7F85', marginTop: 2 }}>
                      {item.phone}
                    </Text>
                  </View>

                  {/* Badge já cadastrado */}
                  {already && (
                    <View
                      style={{
                        backgroundColor: '#E8F4F6', paddingHorizontal: 8,
                        paddingVertical: 4, borderRadius: 8,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#0D4F5C' }}>
                        Já cadastrado
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}
