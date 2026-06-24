import { AdBanner } from '@/components/AdBanner';
import { FinancialTipsCard } from '@/components/financial-tips-card';
import { LogoFull } from '@/components/logo';
import { Theme } from '@/constants/theme';
import { useAppointments } from '@/hooks/use-appointments';
import { useProfile } from '@/hooks/use-profile';
import { useTransactions } from '@/hooks/use-transactions';
import { useDrawerStore } from '@/stores/drawer';
import { useUIStore } from '@/stores/ui';
import { Ionicons } from '@expo/vector-icons';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth';


const formatCurrency = (value: number): string =>
  `R$ ${value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfile();
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  const { transactions, fetchTransactions } = useTransactions({ type: 'all' });
  const { appointments, fetchAppointments } = useAppointments();

  const { showAlert } = useUIStore();


  // Recarrega os dados quando o ID do usuário autenticado mudar (login / recuperação / troca de usuário)
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
      fetchAppointments();
      fetchProfile();
    }
  }, [user?.id]);

  // Recarrega os dados toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
      fetchAppointments();
      fetchProfile();
    }, [])
  );

  // Calcula totais do mês atual
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now).toISOString().split('T')[0];
    const end = endOfMonth(now).toISOString().split('T')[0];

    const monthly = transactions.filter(t => t.date >= start && t.date <= end);

    const totalIncome = monthly
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = monthly
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transactions]);

  // Agendamentos futuros
  const upcomingCount = useMemo(() => {
    return appointments.filter(a => a.status === 'scheduled').length;
  }, [appointments]);

  // Últimas 3 transações para o feed
  const recentTransactions = useMemo(() => transactions.slice(0, 3), [transactions]);

  const { openDrawer } = useDrawerStore();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 64 + insets.bottom;
  const firstName = profile?.name?.split(' ')[0]
    || user?.user_metadata?.full_name?.split(' ')[0]
    || user?.user_metadata?.name?.split(' ')[0]
    || 'Guerreiro';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* ── Header unificado ─────────────────────────────── */}
            <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 }}>

              {/* Linha 1: menu | logo | sino */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                {/* Menu */}
                <TouchableOpacity
                  onPress={openDrawer}
                  style={{
                    width: 40, height: 40,
                    backgroundColor: '#F5F7F8',
                    borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#E2E8EA',
                  }}
                  accessibilityLabel="Abrir menu"
                  accessibilityRole="button"
                >
                  <Ionicons name="menu" size={20} color={Theme.colors.text.primary} />
                </TouchableOpacity>

                {/* Logo centralizada */}
                <LogoFull size="sm" variant="dark" />

                {/* Sino */}
                <TouchableOpacity
                  style={{
                    width: 40, height: 40,
                    backgroundColor: '#F5F7F8',
                    borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#E2E8EA',
                  }}
                  accessibilityLabel="Notificações"
                  accessibilityRole="button"
                >
                  <Ionicons name="notifications-outline" size={20} color={Theme.colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Linha 2: saudação + avatar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: Theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {today}
                  </Text>
                  <Text style={{ fontSize: 26, fontWeight: '900', color: Theme.colors.text.primary, marginTop: 2 }} numberOfLines={1}>
                    Olá, {firstName}!
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    width: 52, height: 52, borderRadius: 26,
                    backgroundColor: '#E8F4F6',
                    borderWidth: 2, borderColor: '#fff',
                    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                  onPress={() => router.push('/perfil')}
                  accessibilityLabel="Ver perfil"
                  accessibilityRole="button"
                >
                  <Ionicons name="construct" size={28} color={Theme.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Grid de Status */}
            <View className="px-6 mt-4">
              <View className="flex-row gap-4 mb-4">
                {/* Card Ganhos */}
                <TouchableOpacity
                  onPress={() => router.push('/ganho')}
                  className="flex-1 rounded-[20px] h-48 overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  accessibilityLabel={`Ganhos este mês: ${formatCurrency(totalIncome)}. Toque para adicionar ganho`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={['#F5FDF6', '#EAFCF0']}
                    className="flex-1 p-5 justify-between"
                  >
                    <View className="bg-[#7BC67A]/10 self-start p-2.5 rounded-[12px]">
                      <Ionicons name="trending-up" size={24} color="#0D4F5C" />
                    </View>
                    <View>
                      <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">Ganhos</Text>
                      <Text className="text-text-primary font-black text-2xl mt-1" numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(totalIncome)}
                      </Text>
                      <View className="bg-[#7BC67A]/15 self-start px-2 py-0.5 rounded-full mt-1.5">
                        <Text className="text-[#0D4F5C] text-[9px] font-black uppercase tracking-wider">Este mês</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Card Gastos */}
                <TouchableOpacity
                  onPress={() => router.push('/gasto')}
                  className="flex-1 rounded-[20px] h-48 overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  accessibilityLabel={`Gastos este mês: ${formatCurrency(totalExpense)}. Toque para adicionar gasto`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={['#FFF5F5', '#FFF0F0']}
                    className="flex-1 p-5 justify-between"
                  >
                    <View className="bg-[#E05555]/10 self-start p-2.5 rounded-[12px]">
                      <Ionicons name="trending-down" size={24} color="#E05555" />
                    </View>
                    <View>
                      <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">Gastos</Text>
                      <Text className="text-text-primary font-black text-2xl mt-1" numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(totalExpense)}
                      </Text>
                      <View className="bg-[#E05555]/15 self-start px-2 py-0.5 rounded-full mt-1.5">
                        <Text className="text-[#E05555] text-[9px] font-black uppercase tracking-wider">Este mês</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-4">
                {/* Card Saldo - Premium Dark Card Style */}
                <TouchableOpacity
                  onPress={() => router.push('/relatorios')}
                  className="flex-1 rounded-[20px] h-48 overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  accessibilityLabel={`Saldo disponível: ${formatCurrency(balance)}. Toque para ver relatórios`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={['#0D4F5C', '#1A6B7A']}
                    className="flex-1 p-5 justify-between"
                  >
                    <View className="bg-white/10 self-start p-2.5 rounded-[12px]">
                      <Ionicons name="wallet" size={24} color="#7BC67A" />
                    </View>
                    <View>
                      <Text className="text-white/70 text-xs font-bold uppercase tracking-wider">Saldo</Text>
                      <Text
                        className="font-black text-2xl mt-1 text-white"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {formatCurrency(balance)}
                      </Text>
                      <View className="bg-white/10 self-start px-2 py-0.5 rounded-full mt-1.5">
                        <Text className="text-[#7BC67A] text-[9px] font-black uppercase tracking-wider">Disponível</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Card Agenda */}
                <TouchableOpacity
                  onPress={() => router.push('/agenda')}
                  className="flex-1 rounded-[20px] h-48 overflow-hidden shadow-sm"
                  activeOpacity={0.9}
                  accessibilityLabel={`${upcomingCount} serviços agendados. Toque para ver a agenda`}
                  accessibilityRole="button"
                >
                  <LinearGradient
                    colors={['#FFFDF5', '#FFF9E6']}
                    className="flex-1 p-5 justify-between"
                  >
                    <View className="bg-[#F0A500]/10 self-start p-2.5 rounded-[12px]">
                      <Ionicons name="calendar" size={24} color="#F0A500" />
                    </View>
                    <View>
                      <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">Agenda</Text>
                      <Text className="text-text-primary font-black text-2xl mt-1">
                        {upcomingCount} {upcomingCount === 1 ? 'Corre' : 'Corres'}
                      </Text>
                      <View className="bg-[#F0A500]/15 self-start px-2 py-0.5 rounded-full mt-1.5">
                        <Text className="text-[#F0A500] text-[9px] font-black uppercase tracking-wider">Agendados</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cabeçalho dos últimos corres */}
            <View className="px-6 mt-10 flex-row justify-between items-center">
              <Text className="text-2xl font-black text-text-primary">Meus Corres</Text>
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => router.push('/historico')}
                accessibilityLabel="Ver todos os lançamentos"
                accessibilityRole="button"
              >
                <Text className="text-text-secondary font-bold mr-1">Ver todos</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7F85" />
              </TouchableOpacity>
            </View>

            {recentTransactions.length === 0 && (
              <View className="px-6 mt-4">
                <View className="bg-surface/50 p-8 rounded-[14px] shadow-sm items-center w-full">
                  <Ionicons name="receipt-outline" size={48} color={Theme.colors.text.muted} />
                  <Text className="text-text-secondary font-black text-lg mt-4 text-center">
                    Nenhum lançamento ainda
                  </Text>
                  <Text className="text-text-hint font-medium text-sm mt-1 text-center">
                    Registre seu primeiro ganho ou gasto!
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
        renderItem={({ item }) => (
          <View className="px-6 mt-3">
            <TouchableOpacity
              className="bg-white rounded-[14px] shadow-sm overflow-hidden"
              activeOpacity={0.8}
              onPress={() => {
                router.push(`/corre/${item.id}`);
              }}
              accessibilityLabel={`${item.type === 'income' ? 'Ganho' : 'Gasto'}: ${item.title}, ${formatCurrency(item.amount)}`}
              accessibilityRole="button"
            >

              <View className="p-4 flex-row items-center">
                <View
                  className={`w-12 h-12 rounded-[12px] items-center justify-center mr-3.5 ${
                    item.type === 'income' ? 'bg-[#7BC67A]/10' : 'bg-[#E05555]/10'
                  }`}
                >
                  <Ionicons
                    name={item.type === 'income' ? 'arrow-up-circle' : 'arrow-down-circle'}
                    size={26}
                    color={item.type === 'income' ? '#7BC67A' : '#E05555'}
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-2">
                      <Text className="text-text-primary font-bold text-base leading-tight" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-text-secondary font-semibold text-xs mt-0.5" numberOfLines={1}>
                        {item.clients?.name || item.description || '—'}
                      </Text>
                    </View>
                    <Text className={`font-black text-base ${item.type === 'income' ? 'text-[#7BC67A]' : 'text-[#E05555]'}`}>
                      {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                    </Text>
                  </View>

                  <View className="flex-row mt-3.5 items-center justify-between">
                    <View className="flex-row items-center bg-surface px-2.5 py-1 rounded-[6px]">
                      <Ionicons name="calendar-outline" size={12} color="#6B7F85" />
                      <Text className="text-text-secondary font-bold text-[10px] ml-1 uppercase tracking-tighter">
                        {item.date ? format(new Date(item.date + 'T00:00:00'), 'dd/MM/yy') : '—'}
                      </Text>
                    </View>

                    <View
                      className={`px-3 py-1 rounded-full ${
                        item.status === 'concluido' ? 'bg-[#7BC67A]/10' : 'bg-[#F0A500]/10'
                      }`}
                    >
                      <Text
                        className={`text-[9px] font-black uppercase tracking-widest ${
                          item.status === 'concluido' ? 'text-[#7BC67A]' : 'text-[#F0A500]'
                        }`}
                      >
                        {item.status === 'concluido' ? 'Concluído' : 'Pendente'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={{ marginTop: 16, paddingBottom: TAB_BAR_HEIGHT + 16 }}>
            <FinancialTipsCard />

            {/* Banner de anúncio no final da tela */}
            <View style={{ marginTop: 12 }}>
              <AdBanner size="BANNER" />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

