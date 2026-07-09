import { ScreenHeader } from '@/components/screen-header';
import { usePagination } from '@/hooks/use-pagination';
import { useTransactions } from '@/hooks/use-transactions';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoricoScreen() {
  const { transactions, loading, filters, setFilters, fetchTransactions } = useTransactions();

  const resetKey = JSON.stringify(filters);
  const { visibleData, hasMore, loadMore } = usePagination(transactions, 20, resetKey);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState<'start' | 'end'>('start');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      if (dateType === 'start') {
        setFilters({ ...filters, startDate: dateString });
      } else {
        setFilters({ ...filters, endDate: dateString });
      }
    }
  };

  const clearFilters = () => {
    setFilters({ type: 'all', startDate: undefined, endDate: undefined, clientId: undefined, search: '', status: 'all' });
  };

  // Conta quantos filtros estão ativos (além do padrão)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type && filters.type !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  }, [filters]);

  // Totais calculados sobre o array completo já filtrado pelo hook
  const totals = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const showTotalsCard = activeFilterCount > 0 || !!filters.search;

  const fmt = (v: number) =>
    `R$ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  // Labels resumidos dos filtros ativos para exibir na barra
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.type === 'income') parts.push('Ganhos');
    else if (filters.type === 'expense') parts.push('Gastos');
    if (filters.status === 'concluido') parts.push('Concluídos');
    else if (filters.status === 'pendente') parts.push('Pendentes');
    if (filters.startDate && filters.endDate)
      parts.push(`${format(parseISO(filters.startDate), 'dd/MM')} – ${format(parseISO(filters.endDate), 'dd/MM')}`);
    else if (filters.startDate)
      parts.push(`A partir de ${format(parseISO(filters.startDate), 'dd/MM')}`);
    else if (filters.endDate)
      parts.push(`Até ${format(parseISO(filters.endDate), 'dd/MM')}`);
    return parts.join(' · ');
  }, [filters]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push(`/corre/${item.id}`)}
      className="bg-white rounded-[20px] mb-4 shadow-sm overflow-hidden"
      activeOpacity={0.8}
    >
      <View className="p-5 flex-row items-center bg-white">
        <View
          className="w-14 h-14 rounded-[16px] items-center justify-center mr-4"
          style={{ backgroundColor: item.type === 'income' ? 'rgba(123, 198, 122, 0.1)' : 'rgba(224, 85, 85, 0.1)' }}
        >
          <Ionicons
            name={item.type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle'}
            size={28}
            color={item.type === 'income' ? '#7BC67A' : '#E05555'}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
              <Text className="text-text-primary font-black text-[17px] leading-tight" numberOfLines={1}>{item.title}</Text>
              <Text className="text-text-secondary font-bold text-xs mt-1" numberOfLines={1}>
                {item.clients?.name || item.description || (item.type === 'income' ? 'Sem cliente' : 'Gasto geral')}
              </Text>
            </View>
            <Text className="font-black text-lg" style={{ color: item.type === 'income' ? '#7BC67A' : '#E05555' }}>
              {item.type === 'income' ? '+' : '-'} R$ {Number(item.amount).toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View className="flex-row mt-3 items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="flex-row items-center bg-surface px-2.5 py-1 rounded-[8px]">
                <Ionicons name="calendar-outline" size={12} color="#6B7F85" />
                <Text className="text-text-secondary font-bold text-[10px] ml-1 uppercase tracking-tighter">
                  {format(parseISO(item.date), "dd 'de' MMMM", { locale: ptBR })}
                </Text>
              </View>
              {item.type === 'income' && (
                <View
                  className="flex-row items-center px-2.5 py-1 rounded-[8px] ml-2"
                  style={{ backgroundColor: item.status === 'pendente' ? 'rgba(240, 165, 0, 0.1)' : 'rgba(123, 198, 122, 0.1)' }}
                >
                  <Ionicons
                    name={item.status === 'pendente' ? 'time-outline' : 'checkmark-circle-outline'}
                    size={12}
                    color={item.status === 'pendente' ? '#F0A500' : '#7BC67A'}
                  />
                  <Text
                    className="font-bold text-[10px] ml-1 uppercase tracking-tighter"
                    style={{ color: item.status === 'pendente' ? '#F0A500' : '#7BC67A' }}
                  >
                    {item.status === 'pendente' ? 'Pendente' : 'Concluído'}
                  </Text>
                </View>
              )}
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: item.type === 'income' ? 'rgba(123, 198, 122, 0.1)' : 'rgba(224, 85, 85, 0.1)' }}
            >
              <Text
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: item.type === 'income' ? '#7BC67A' : '#E05555' }}
              >
                {item.type === 'income' ? 'Ganho' : 'Gasto'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScreenHeader
        title="Histórico"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            style={{
              width: 42, height: 42, borderRadius: 13,
              backgroundColor: activeFilterCount > 0 ? '#0D4F5C' : '#F0F4F5',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: activeFilterCount > 0 ? '#0D4F5C' : '#E2E8EA',
            }}
            accessibilityLabel="Abrir filtros"
            accessibilityRole="button"
          >
            <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? '#fff' : '#0D4F5C'} />
            {activeFilterCount > 0 && (
              <View style={{
                position: 'absolute', top: -4, right: -4,
                width: 16, height: 16, borderRadius: 8,
                backgroundColor: '#7BC67A', alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Barra de busca + resumo de filtros ativos */}
      <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#F5F7F8', borderRadius: 16,
          paddingHorizontal: 16, height: 48,
          borderWidth: 1, borderColor: '#E2E8EA',
        }}>
          <Ionicons name="search-outline" size={18} color="#A0B0B5" />
          <TextInput
            placeholder="Buscar por título ou descrição..."
            placeholderTextColor="#A0B0B5"
            style={{ flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '500', color: '#1A1A1A' }}
            value={filters.search}
            onChangeText={(text) => setFilters({ ...filters, search: text })}
          />
          {filters.search ? (
            <TouchableOpacity onPress={() => setFilters({ ...filters, search: '' })} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={18} color="#A0B0B5" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Chips de filtros ativos */}
        {(activeFilterCount > 0 || filterSummary) ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
            <View style={{
              flex: 1, backgroundColor: '#E8F4F6', borderRadius: 10,
              paddingHorizontal: 10, paddingVertical: 6,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#0D4F5C' }} numberOfLines={1}>
                {filterSummary || 'Filtros ativos'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                backgroundColor: '#FFF0F0', borderRadius: 10,
                paddingHorizontal: 10, paddingVertical: 6,
                flexDirection: 'row', alignItems: 'center', gap: 4,
              }}
              accessibilityLabel="Limpar filtros"
            >
              <Ionicons name="close" size={12} color="#E05555" />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#E05555' }}>Limpar</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Card de totais */}
      {showTotalsCard && !loading && transactions.length > 0 && (
        <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
          <View style={{
            backgroundColor: '#F8FAFB', borderRadius: 16,
            borderWidth: 1, borderColor: '#E2E8EA',
          }}>
            <View style={{ flexDirection: 'row' }}>
              {filters.type !== 'expense' && (
                <View style={{
                  flex: 1, padding: 12, alignItems: 'center',
                  borderRightWidth: filters.type === 'all' ? 1 : 0,
                  borderRightColor: '#E2E8EA',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                    <Ionicons name="arrow-up-circle" size={12} color="#7BC67A" />
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#6B7F85', marginLeft: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {filters.type === 'income' ? 'Total' : 'Ganhos'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '900', color: '#7BC67A' }} numberOfLines={1} adjustsFontSizeToFit>
                    {fmt(totals.income)}
                  </Text>
                </View>
              )}
              {filters.type !== 'income' && (
                <View style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                    <Ionicons name="arrow-down-circle" size={12} color="#E05555" />
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#6B7F85', marginLeft: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {filters.type === 'expense' ? 'Total' : 'Gastos'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '900', color: '#E05555' }} numberOfLines={1} adjustsFontSizeToFit>
                    {fmt(totals.expense)}
                  </Text>
                </View>
              )}
            </View>
            {filters.type === 'all' && (
              <View style={{
                borderTopWidth: 1, borderTopColor: '#E2E8EA',
                paddingVertical: 8, flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Ionicons name="wallet-outline" size={12} color="#0D4F5C" />
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#6B7F85', textTransform: 'uppercase', letterSpacing: 1 }}>Saldo:</Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: totals.balance >= 0 ? '#0D4F5C' : '#E05555' }}>
                  {totals.balance >= 0 ? '' : '-'}{fmt(Math.abs(totals.balance))}
                </Text>
              </View>
            )}
            <View style={{ borderTopWidth: 1, borderTopColor: '#E2E8EA', paddingVertical: 6, alignItems: 'center' }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#A0B0B5' }}>
                {transactions.length} {transactions.length === 1 ? 'registro' : 'registros'} encontrado{transactions.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0D4F5C" />
          <Text className="text-text-secondary font-bold mt-4">Buscando transações...</Text>
        </View>
      ) : (
        <FlatList
          data={visibleData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 8 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            hasMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#0D4F5C" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center mt-20 px-6">
              <View className="bg-surface p-8 rounded-full mb-6">
                <Ionicons name="receipt-outline" size={64} color="#C5D0D3" />
              </View>
              <Text className="text-text-primary font-black text-xl text-center">Nenhum registro encontrado</Text>
              <Text className="text-text-secondary font-bold text-center mt-2 text-sm leading-relaxed">
                Tente ajustar seus filtros para encontrar o que procura.
              </Text>
            </View>
          }
        />
      )}

      {/* Modal de Filtros */}
      <Modal visible={showFilterModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            paddingBottom: insets.bottom + 16,
          }}>
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#E2E8EA' }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
              {/* Header do modal */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#1A1A1A' }}>Filtros</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Ionicons name="close-circle" size={28} color="#A0B0B5" />
                </TouchableOpacity>
              </View>

              {/* Tipo */}
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                Tipo
              </Text>
              <View style={{ flexDirection: 'row', backgroundColor: '#F5F7F8', borderRadius: 14, padding: 4, marginBottom: 20 }}>
                {[
                  { label: 'Todos', value: 'all', icon: 'list-outline', color: '#0D4F5C' },
                  { label: 'Ganhos', value: 'income', icon: 'arrow-up-circle-outline', color: '#7BC67A' },
                  { label: 'Gastos', value: 'expense', icon: 'arrow-down-circle-outline', color: '#E05555' },
                ].map((type) => {
                  const isActive = filters.type === type.value;
                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => setFilters({ ...filters, type: type.value as any })}
                      style={{
                        flex: 1, paddingVertical: 10, borderRadius: 10,
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                        backgroundColor: isActive ? '#fff' : 'transparent',
                        shadowColor: isActive ? '#0D4F5C' : 'transparent',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08, shadowRadius: 4, elevation: isActive ? 2 : 0,
                      }}
                      accessibilityLabel={`Filtrar por ${type.label}`}
                    >
                      <Ionicons name={type.icon as any} size={15} color={isActive ? type.color : '#6B7F85'} style={{ marginRight: 5 }} />
                      <Text style={{ fontSize: 11, fontWeight: '800', color: isActive ? '#1A1A1A' : '#6B7F85', textTransform: 'uppercase' }}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Status */}
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                Status
              </Text>
              <View style={{ flexDirection: 'row', backgroundColor: '#F5F7F8', borderRadius: 14, padding: 4, marginBottom: 20 }}>
                {[
                  { label: 'Todos', value: 'all', icon: 'apps-outline', color: '#0D4F5C' },
                  { label: 'Concluídos', value: 'concluido', icon: 'checkmark-circle-outline', color: '#7BC67A' },
                  { label: 'Pendentes', value: 'pendente', icon: 'time-outline', color: '#F0A500' },
                ].map((status) => {
                  const isActive = filters.status === status.value;
                  return (
                    <TouchableOpacity
                      key={status.value}
                      onPress={() => setFilters({ ...filters, status: status.value as any })}
                      style={{
                        flex: 1, paddingVertical: 10, borderRadius: 10,
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
                        backgroundColor: isActive ? '#fff' : 'transparent',
                        shadowColor: isActive ? '#0D4F5C' : 'transparent',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08, shadowRadius: 4, elevation: isActive ? 2 : 0,
                      }}
                    >
                      <Ionicons name={status.icon as any} size={13} color={isActive ? status.color : '#6B7F85'} style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 10, fontWeight: '800', color: isActive ? '#1A1A1A' : '#6B7F85', textTransform: 'uppercase' }}>
                        {status.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Período */}
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>
                Período
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                <TouchableOpacity
                  onPress={() => { setDateType('start'); setShowDatePicker(true); }}
                  style={{
                    flex: 1, backgroundColor: filters.startDate ? '#E8F4F6' : '#F5F7F8',
                    borderRadius: 14, padding: 14, flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                    borderWidth: 1, borderColor: filters.startDate ? '#0D4F5C' : '#E2E8EA',
                  }}
                >
                  <Ionicons name="calendar-outline" size={16} color={filters.startDate ? '#0D4F5C' : '#6B7F85'} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: filters.startDate ? '#0D4F5C' : '#6B7F85', textTransform: 'uppercase' }}>
                    {filters.startDate ? format(parseISO(filters.startDate), 'dd/MM/yy') : 'Início'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setDateType('end'); setShowDatePicker(true); }}
                  style={{
                    flex: 1, backgroundColor: filters.endDate ? '#E8F4F6' : '#F5F7F8',
                    borderRadius: 14, padding: 14, flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center', gap: 6,
                    borderWidth: 1, borderColor: filters.endDate ? '#0D4F5C' : '#E2E8EA',
                  }}
                >
                  <Ionicons name="calendar-outline" size={16} color={filters.endDate ? '#0D4F5C' : '#6B7F85'} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: filters.endDate ? '#0D4F5C' : '#6B7F85', textTransform: 'uppercase' }}>
                    {filters.endDate ? format(parseISO(filters.endDate), 'dd/MM/yy') : 'Fim'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botões de ação */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {activeFilterCount > 0 && (
                  <TouchableOpacity
                    onPress={() => { clearFilters(); setShowFilterModal(false); }}
                    style={{
                      flex: 1, backgroundColor: '#FFF0F0', borderRadius: 14,
                      paddingVertical: 14, alignItems: 'center', flexDirection: 'row',
                      justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#E05555" />
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#E05555' }}>Limpar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setShowFilterModal(false)}
                  style={{
                    flex: 2, backgroundColor: '#0D4F5C', borderRadius: 14,
                    paddingVertical: 14, alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#fff' }}>
                    Ver {transactions.length} resultado{transactions.length !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={dateType === 'start'
            ? (filters.startDate ? parseISO(filters.startDate) : new Date())
            : (filters.endDate ? parseISO(filters.endDate) : new Date())
          }
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}
