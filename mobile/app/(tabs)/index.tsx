import { FinancialTipsCard } from '@/components/financial-tips-card';
import { LogoFull } from '@/components/logo';
import { Theme } from '@/constants/theme';
import { useAppointments } from '@/hooks/use-appointments';
import { useProfile } from '@/hooks/use-profile';
import { useTransactions } from '@/hooks/use-transactions';
import { useDrawerStore } from '@/stores/drawer';
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
  const todayLabel = format(new Date(), "EEE, d 'de' MMM", { locale: ptBR }).toUpperCase();

  const { transactions, fetchTransactions } = useTransactions({ type: 'all' });
  const { appointments, fetchAppointments } = useAppointments();

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
      fetchAppointments();
      fetchProfile();
    }
  }, [user?.id, fetchTransactions, fetchAppointments, fetchProfile]);

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions();
      fetchAppointments();
      fetchProfile();
    }, [fetchTransactions, fetchAppointments, fetchProfile])
  );

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now).toISOString().split('T')[0];
    const end = endOfMonth(now).toISOString().split('T')[0];
    const monthly = transactions.filter(t => t.date >= start && t.date <= end);
    const totalIncome = monthly.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
    const totalExpense = monthly.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [transactions]);

  const upcomingCount = useMemo(
    () => appointments.filter(a => a.status === 'scheduled').length,
    [appointments]
  );

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  const { openDrawer } = useDrawerStore();
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 64 + insets.bottom;

  const firstName =
    profile?.name?.split(' ')[0] ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.user_metadata?.name?.split(' ')[0] ||
    'Guerreiro';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.primary }} edges={['top']}>
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: '#EEF2F5' }}
        ListHeaderComponent={() => (
          <>
            {/* ── Hero Header ───────────────────────────── */}
            <LinearGradient
              colors={['#0B4554', '#0D4F5C', '#1A6B7A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 52 }}
            >
              {/* Esferas decorativas */}
              <View style={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)' }} />
              <View style={{ position: 'absolute', left: -30, bottom: 10, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(123,198,122,0.07)' }} />

              {/* Linha 1: Menu | Logo | Sino */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <TouchableOpacity
                  onPress={openDrawer}
                  style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                  accessibilityLabel="Abrir menu"
                  accessibilityRole="button"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="menu" size={21} color="#FFFFFF" />
                </TouchableOpacity>

                <LogoFull size="sm" variant="white" />

                <TouchableOpacity
                  style={{ width: 42, height: 42, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                  accessibilityLabel="Notificações"
                  accessibilityRole="button"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="notifications-outline" size={21} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Linha 2: Saudação + Avatar */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1.8, marginBottom: 5 }}>
                    {todayLabel}
                  </Text>
                  <Text style={{ fontSize: 27, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 }} numberOfLines={1}>
                    Olá, {firstName}!
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#7BC67A', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.3)', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => router.push('/perfil')}
                  accessibilityLabel="Ver perfil"
                  accessibilityRole="button"
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
                    {firstName.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* ── Card de Saldo (sobrepõe o hero) ─────── */}
            <View style={{ paddingHorizontal: 16, marginTop: -36 }}>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22, shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 28, elevation: 14 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#A0B0B5', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Saldo do Mês
                </Text>
                <Text
                  style={{ fontSize: 36, fontWeight: '900', color: '#1A1A1A', letterSpacing: -1, marginBottom: 20 }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatCurrency(balance)}
                </Text>

                <View style={{ flexDirection: 'row', paddingTop: 18, borderTopWidth: 1, borderTopColor: '#F0F4F5' }}>
                  {/* Ganhos */}
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => router.push('/ganho')}
                    accessibilityLabel={`Ganhos do mês: ${formatCurrency(totalIncome)}`}
                    accessibilityRole="button"
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7, gap: 7 }}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(123,198,122,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="trending-up" size={15} color="#7BC67A" />
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#A0B0B5', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ganhos</Text>
                    </View>
                    <Text style={{ fontSize: 19, fontWeight: '900', color: '#7BC67A' }} numberOfLines={1} adjustsFontSizeToFit>
                      {formatCurrency(totalIncome)}
                    </Text>
                  </TouchableOpacity>

                  <View style={{ width: 1, backgroundColor: '#F0F4F5', marginHorizontal: 16, alignSelf: 'stretch' }} />

                  {/* Gastos */}
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => router.push('/gasto')}
                    accessibilityLabel={`Gastos do mês: ${formatCurrency(totalExpense)}`}
                    accessibilityRole="button"
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 7, gap: 7 }}>
                      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(224,85,85,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="trending-down" size={15} color="#E05555" />
                      </View>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#A0B0B5', textTransform: 'uppercase', letterSpacing: 0.5 }}>Gastos</Text>
                    </View>
                    <Text style={{ fontSize: 19, fontWeight: '900', color: '#E05555' }} numberOfLines={1} adjustsFontSizeToFit>
                      {formatCurrency(totalExpense)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ── Chip de Agenda ──────────────────────── */}
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => router.push('/agenda')}
                activeOpacity={0.85}
                accessibilityLabel={`${upcomingCount} corres agendados. Toque para ver a agenda`}
                accessibilityRole="button"
                style={{ backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 }}
              >
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(240,165,0,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  <Ionicons name="calendar" size={22} color="#F0A500" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#A0B0B5', textTransform: 'uppercase', letterSpacing: 1 }}>Agenda</Text>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#1A1A1A', marginTop: 2 }}>
                    {upcomingCount} {upcomingCount === 1 ? 'Corre agendado' : 'Corres agendados'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#F0A500' }}>Ver</Text>
                  <Ionicons name="chevron-forward" size={16} color="#F0A500" />
                </View>
              </TouchableOpacity>
            </View>

            {/* ── Cabeçalho Meus Corres ───────────────── */}
            <View style={{ paddingHorizontal: 20, marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#1A1A1A', letterSpacing: -0.3 }}>
                Meus Corres
              </Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                onPress={() => router.push('/historico')}
                accessibilityLabel="Ver todos os lançamentos"
                accessibilityRole="button"
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: Theme.colors.primary }}>Ver todos</Text>
                <Ionicons name="chevron-forward" size={14} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>

            {recentTransactions.length === 0 && (
              <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 22, padding: 32, alignItems: 'center', shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 }}>
                  <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#F0F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Ionicons name="receipt-outline" size={34} color="#A0B0B5" />
                  </View>
                  <Text style={{ fontSize: 17, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', marginBottom: 6 }}>
                    Nenhum lançamento ainda
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: '#6B7F85', textAlign: 'center' }}>
                    Registre seu primeiro ganho ou gasto!
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', shadowColor: '#0D4F5C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 }}
              activeOpacity={0.8}
              onPress={() => router.push(`/corre/${item.id}`)}
              accessibilityLabel={`${item.type === 'income' ? 'Ganho' : 'Gasto'}: ${item.title}, ${formatCurrency(item.amount)}`}
              accessibilityRole="button"
            >
              {/* Faixa lateral colorida */}
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: item.type === 'income' ? '#7BC67A' : '#E05555', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} />

              <View style={{ padding: 16, paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 14, backgroundColor: item.type === 'income' ? 'rgba(123,198,122,0.1)' : 'rgba(224,85,85,0.1)' }}>
                  <Ionicons
                    name={item.type === 'income' ? 'arrow-up' : 'arrow-down'}
                    size={22}
                    color={item.type === 'income' ? '#7BC67A' : '#E05555'}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.2 }} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7F85', marginTop: 2 }} numberOfLines={1}>
                        {item.clients?.name || item.description || '—'}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '900', color: item.type === 'income' ? '#7BC67A' : '#E05555' }}>
                      {item.type === 'income' ? '+' : '−'} {formatCurrency(item.amount)}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: '#A0B0B5' }}>
                      {item.date ? format(new Date(item.date + 'T00:00:00'), 'dd/MM/yy') : '—'}
                    </Text>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, backgroundColor: item.status === 'concluido' ? 'rgba(123,198,122,0.12)' : 'rgba(240,165,0,0.12)' }}>
                      <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', color: item.status === 'concluido' ? '#7BC67A' : '#F0A500' }}>
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
          <View style={{ paddingBottom: TAB_BAR_HEIGHT + 16, marginTop: 8 }}>
            <FinancialTipsCard />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
