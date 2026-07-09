import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { eachDayOfInterval, format, isSameDay, startOfMonth } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    LineChart,
    PieChart
} from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/screen-header';
import { Theme } from '../../constants/theme';
import { useExpenseCategories } from '../../hooks/use-expense-categories';
import { useTransactions } from '../../hooks/use-transactions';

const { width } = Dimensions.get('window');

const CategoryBarChart = ({ data }: { data: any[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 180;

  return (
    <View className="flex-row items-end justify-around px-2 w-full h-[240px]">
      {data.map((item, index) => {
        // Altura mínima para o ícone aparecer
        const barHeight = (item.value / maxVal) * chartHeight;
        return (
          <View key={index} className="items-center flex-1 mx-2">
            <View 
              style={{ 
                height: Math.max(barHeight, 48), 
                backgroundColor: item.frontColor,
                width: '100%',
                borderRadius: 20,
                justifyContent: 'flex-end',
                paddingBottom: 14,
                alignItems: 'center',
                shadowColor: item.frontColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5
              }}
            >
              <Ionicons 
                name={((item.icon && item.icon !== '') ? item.icon : 'grid-outline') as any} 
                size={20} 
                color="white" 
              />
            </View>
            <View className="mt-3 items-center">
              <Text className="text-[11px] font-black text-[#0D4F5C] uppercase text-center w-full" numberOfLines={1}>
                {item.label}
              </Text>
              <Text className="text-[11px] font-bold text-text-secondary mt-0.5">
                R${Math.round(item.value)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function RelatoriosScreen() {
  const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
  const [toDate, setToDate] = useState(new Date());
  
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'month' | 'week' | 'custom'>('month');

  const setFilter = (type: 'month' | 'week') => {
    setActiveFilter(type);
    const now = new Date();
    if (type === 'month') {
      setFromDate(startOfMonth(now));
      setToDate(now);
    } else {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      setFromDate(lastWeek);
      setToDate(now);
    }
  };

  const { categories: expenseCategories = [] } = useExpenseCategories();

  const { transactions = [], loading, setFilters } = useTransactions({
    startDate: format(fromDate, 'yyyy-MM-dd'),
    endDate: format(toDate, 'yyyy-MM-dd'),
    type: 'all'
  });

  // Atualizar filtros quando as datas mudam
  useEffect(() => {
    if (fromDate && toDate) {
      setFilters({
        startDate: format(fromDate, 'yyyy-MM-dd'),
        endDate: format(toDate, 'yyyy-MM-dd'),
        type: 'all'
      });
    }
  }, [fromDate, toDate, setFilters]);

  // Cálculos de Resumo
  const stats = useMemo(() => {
    const income = (transactions || [])
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expense = (transactions || [])
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const completed = (transactions || []).filter(t => t.type === 'income' && t.status === 'concluido').length;
    const pending = (transactions || []).filter(t => t.type === 'income' && t.status === 'pendente').length;
    
    return {
      income: Number(income) || 0,
      expense: Number(expense) || 0,
      balance: Number(income - expense) || 0,
      completed,
      pending
    };
  }, [transactions]);

  // Dados para o Gráfico de Barras por Categoria (Gastos)
  const categoryBarData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totals: {[key: string]: number} = {};
    
    expenseTransactions.forEach(t => {
      const cat = t.category || 'Outros';
      totals[cat] = (totals[cat] || 0) + (Number(t.amount) || 0);
    });

    const data = Object.keys(totals)
      .sort((a, b) => totals[b] - totals[a])
      .map((name) => {
        const catInfo = (expenseCategories || []).find(c => c.name === name);
        const value = Number(totals[name]) || 0;
        return {
          value,
          label: name,
          frontColor: catInfo?.color || '#0D4F5C',
          icon: catInfo?.icon || 'grid-outline',
          topLabelComponent: () => (
            <View style={{ marginBottom: 8, alignItems: 'center' }}>
              <View 
                style={{ 
                  backgroundColor: (catInfo?.color || '#0D4F5C'),
                  padding: 5,
                  borderRadius: 6,
                  marginBottom: 3,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 1,
                  elevation: 1
                }}
              >
                <Ionicons 
                  name={((catInfo?.icon && catInfo.icon !== '') ? catInfo.icon : 'grid-outline') as any} 
                  size={12} 
                  color="white" 
                />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '900', color: '#0D4F5C' }}>
                R${Math.round(value)}
              </Text>
            </View>
          ),
        };
      });
    return data;
  }, [transactions, expenseCategories]);

  // Dados para o Gráfico de Pizza (Categorias de Gastos)
  const pieData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categories: {[key: string]: number} = {};
    
    expenseTransactions.forEach(t => {
      const cat = t.category || 'Outros';
      categories[cat] = (categories[cat] || 0) + (Number(t.amount) || 0);
    });

    return Object.keys(categories).map((name) => {
      const catInfo = (expenseCategories || []).find(c => c.name === name);
      return {
        value: Number(categories[name]) || 0,
        text: name,
        color: catInfo?.color || '#0D4F5C',
        label: name
      };
    });
  }, [transactions, expenseCategories]);

  // Dados para o Gráfico de Linha (Evolução do Saldo Acumulado)
  const lineData = useMemo(() => {
    if (!fromDate || !toDate) return [{ value: 0, label: '' }];
    
    const days = eachDayOfInterval({
      start: fromDate,
      end: toDate
    });

    const step = Math.max(1, Math.floor(days.length / 10));

    let runningBalance = 0;

    const mappedData = days.map((day, index) => {
      const dayTransactions = (transactions || []).filter(t => {
        if (!t.date) return false;
        try {
          return isSameDay(new Date(t.date), day);
        } catch {
          return false;
        }
      });
      const dailyIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const dailyExpense = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      
      runningBalance += dailyIncome - dailyExpense;

      return {
        value: Number(runningBalance) || 0,
        label: index % step === 0 ? format(day, 'dd/MM') : '',
      };
    });

    if (mappedData.length === 1) {
      return [{ value: 0, label: '' }, ...mappedData];
    }
    return mappedData;
  }, [transactions, fromDate, toDate]);

  // Ranking de Clientes
  const clientStats = useMemo(() => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const counts: {[key: string]: { name: string, count: number, total: number }} = {};

    incomeTransactions.forEach(t => {
      const clientId = t.client_id;
      if (!clientId) return;
      
      const name = t.clients?.name || 'Cliente';
      if (!counts[clientId]) {
        counts[clientId] = { name, count: 0, total: 0 };
      }
      counts[clientId].count += 1;
      counts[clientId].total += (Number(t.amount) || 0);
    });

    const ranking = Object.values(counts);
    const topByFrequency = [...ranking].sort((a, b) => b.count - a.count).slice(0, 3);
    const topByRevenue = [...ranking].sort((a, b) => b.total - a.total).slice(0, 3);

    return { topByFrequency, topByRevenue };
  }, [transactions]);

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(13, 79, 92, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 127, 133, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 11,
      fontWeight: 'bold'
    }
  };

  const lineChartData = useMemo(() => {
    const labels = lineData.map((d: any) => d.label).filter((_: any, i: number) => i % Math.max(1, Math.floor(lineData.length / 5)) === 0);
    return {
      labels: labels.length > 0 ? labels : [''],
      datasets: [
        {
          data: lineData.map((d: any) => d.value),
          color: (opacity = 1) => `rgba(13, 79, 92, ${opacity})`,
          strokeWidth: 3
        }
      ],
      legend: ["Evolução"]
    };
  }, [lineData]);


  const pieChartData = useMemo(() => {
    return pieData.map(item => ({
      name: item.label,
      population: item.value,
      color: item.color,
      legendFontColor: "#6B7F85",
      legendFontSize: 11
    }));
  }, [pieData]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFB]" edges={['top']}>
      <ScreenHeader title="Inteligência Financeira" showBackButton={false} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Filtros Rápidos (Chips) */}
        <View className="px-6 mt-6 flex-row gap-2">
          <TouchableOpacity
            onPress={() => setFilter('month')}
            className={`px-5 py-2.5 rounded-full ${activeFilter === 'month' ? 'bg-[#0D4F5C]' : 'bg-white border border-divider/50'}`}
            accessibilityLabel="Filtrar por mês atual"
            accessibilityRole="button"
          >
            <Text className={`text-[11px] font-black uppercase ${activeFilter === 'month' ? 'text-white' : 'text-text-secondary'}`}>Mês Atual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('week')}
            className={`px-5 py-2.5 rounded-full ${activeFilter === 'week' ? 'bg-[#0D4F5C]' : 'bg-white border border-divider/50'}`}
            accessibilityLabel="Filtrar por últimos 7 dias"
            accessibilityRole="button"
          >
            <Text className={`text-[11px] font-black uppercase ${activeFilter === 'week' ? 'text-white' : 'text-text-secondary'}`}>Últimos 7 Dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveFilter('custom')}
            className={`px-5 py-2.5 rounded-full ${activeFilter === 'custom' ? 'bg-[#0D4F5C]' : 'bg-white border border-divider/50'}`}
            accessibilityLabel="Filtrar por período customizado"
            accessibilityRole="button"
          >
            <Text className={`text-[11px] font-black uppercase ${activeFilter === 'custom' ? 'text-white' : 'text-text-secondary'}`}>Customizado</Text>
          </TouchableOpacity>
        </View>

        {/* Filtro de Datas (Só aparece se for customizado) */}
        {activeFilter === 'custom' && (
          <View className="px-6 mt-4">
            <View className="bg-white p-2.5 rounded-2xl flex-row items-center border border-divider/30 shadow-sm">
              <TouchableOpacity
                onPress={() => setShowFromPicker(true)}
                className="flex-1 flex-row items-center justify-center py-1.5"
                accessibilityLabel={`Data inicial: ${format(fromDate, 'dd/MM/yy')}. Toque para alterar`}
                accessibilityRole="button"
              >
                <Ionicons name="calendar-outline" size={14} color="#0D4F5C" />
                <Text className="ml-2 text-xs font-black text-text-primary">{format(fromDate, 'dd/MM/yy')}</Text>
              </TouchableOpacity>
              <View className="w-[1px] h-4 bg-divider" />
              <TouchableOpacity
                onPress={() => setShowToPicker(true)}
                className="flex-1 flex-row items-center justify-center py-1.5"
                accessibilityLabel={`Data final: ${format(toDate, 'dd/MM/yy')}. Toque para alterar`}
                accessibilityRole="button"
              >
                <Ionicons name="calendar-outline" size={14} color="#0D4F5C" />
                <Text className="ml-2 text-xs font-black text-text-primary">{format(toDate, 'dd/MM/yy')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowFromPicker(Platform.OS === 'ios');
              if (date) setFromDate(date);
            }}
          />
        )}

        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowToPicker(Platform.OS === 'ios');
              if (date) setToDate(date);
            }}
          />
        )}

        {/* Hero Section: Saldo com Design Imersivo */}
        <View className="px-6 mt-6">
          <LinearGradient
            colors={['#0D4F5C', '#1A6B7A', '#238496']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-8 rounded-[32px] shadow-2xl relative overflow-hidden"
          >
            <View className="z-10">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white/70 font-bold text-[11px] uppercase tracking-[2px]">SALDO LÍQUIDO</Text>
              </View>
              <Text className="text-white text-4xl font-black mb-6">
                {stats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
              
              <View className="flex-row items-center justify-between bg-black/10 p-5 rounded-2xl border border-white/5">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View className="w-1.5 h-1.5 bg-[#7BC67A] rounded-full mr-2" />
                    <Text className="text-white/60 text-[11px] font-bold uppercase">GANHOS</Text>
                  </View>
                  <Text className="text-white font-black text-lg">
                    {stats.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </Text>
                </View>
                <View className="w-[1px] h-8 bg-white/10 mx-4" />
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View className="w-1.5 h-1.5 bg-[#E05555] rounded-full mr-2" />
                    <Text className="text-white/60 text-[11px] font-bold uppercase">GASTOS</Text>
                  </View>
                  <Text className="text-white font-black text-lg">
                    {stats.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>
            </View>

            {/* Elementos Orgânicos */}
            <View className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full" />
            <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#7BC67A]/10 rounded-full" />
          </LinearGradient>
        </View>

        {loading ? (
          <View className="py-20">
            <ActivityIndicator color={Theme.colors.primary} size="large" />
          </View>
        ) : (
          <View className="pb-10">
            
            {/* Insights do Período */}
            <View className="px-6 mt-8 flex-row gap-4">
              <View className="flex-1 bg-white p-6 rounded-[28px] shadow-sm border border-divider/20">
                <Text className="text-text-secondary font-black text-[11px] uppercase tracking-wider mb-2">MARGEM</Text>
                <View className="flex-row items-end gap-1 mb-2">
                  <Text className="text-2xl font-black text-[#0D4F5C]">
                    {stats.income > 0 ? Math.round((stats.balance / stats.income) * 100) : 0}
                  </Text>
                  <Text className="text-xs font-black text-[#0D4F5C] mb-1">%</Text>
                </View>
                <View className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <View className="h-full bg-[#7BC67A]" style={{ width: `${Math.max(0, Math.min(100, stats.income > 0 ? (stats.balance / stats.income) * 100 : 0))}%` }} />
                </View>
              </View>
              <View className="flex-1 bg-white p-6 rounded-[28px] shadow-sm border border-divider/20">
                <Text className="text-text-secondary font-black text-[11px] uppercase tracking-wider mb-2">MÉDIA DIA</Text>
                <Text className="text-2xl font-black text-[#0D4F5C] mb-1">
                  {(stats.income / (Math.max(1, eachDayOfInterval({ start: fromDate, end: toDate }).length))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </Text>
                <Text className="text-[11px] font-black text-text-secondary uppercase">Reais / Dia</Text>
              </View>
            </View>

            {/* Gráfico de Barras de Gastos (Chart Kit) */}
            {categoryBarData.length > 0 && (
              <View className="px-6 mt-8">
                <Text className="text-lg font-black text-text-primary mb-5 px-1">Distribuição de Gastos</Text>
                <View className="bg-white py-8 rounded-[40px] shadow-2xl shadow-black/[0.03] items-center overflow-hidden border border-divider/10">
                  <CategoryBarChart data={categoryBarData.slice(0, 5)} />
                </View>
              </View>
            )}

            {/* Tendência com Chart Kit (Bezier) */}
            <View className="px-6 mt-8">
              <Text className="text-lg font-black text-text-primary mb-5 px-1">Evolução do Saldo</Text>
              <View className="bg-white py-6 rounded-[32px] shadow-xl shadow-black/[0.03] items-center">
                <LineChart
                  data={lineChartData}
                  width={width - 48}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    borderRadius: 16,
                    marginVertical: 8,
                  }}
                  withInnerLines={false}
                  withOuterLines={true}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                />
              </View>
            </View>

            {/* Inteligência de Clientes */}
            {(clientStats.topByFrequency.length > 0 || clientStats.topByRevenue.length > 0) && (
              <View className="px-6 mt-8">
                <Text className="text-lg font-black text-text-primary mb-5 px-1">Resumo de Clientes</Text>
                
                <View className="flex-row gap-4">
                  {/* Mais Atendidos */}
                  <View className="flex-1 bg-white p-6 rounded-[32px] shadow-sm border border-divider/20">
                    <View className="flex-row items-center mb-5">
                      <View className="w-8 h-8 bg-[#7BC67A]/10 rounded-full items-center justify-center mr-2">
                        <Ionicons name="people" size={16} color="#7BC67A" />
                      </View>
                      <Text className="text-[11px] font-black text-text-primary uppercase tracking-tighter">Frequência</Text>
                    </View>
                    {clientStats.topByFrequency.map((item, index) => (
                      <View key={index} className="flex-row items-center justify-between mb-4 last:mb-0">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-1.5 h-1.5 bg-[#7BC67A] rounded-full mr-2" />
                          <Text className="text-text-primary font-bold text-[11px] flex-1" numberOfLines={1}>{item.name}</Text>
                        </View>
                        <Text className="text-[#0D4F5C] font-black text-xs">{item.count}x</Text>
                      </View>
                    ))}
                  </View>

                  {/* Top Receita */}
                  <View className="flex-1 bg-white p-6 rounded-[32px] shadow-sm border border-divider/20">
                    <View className="flex-row items-center mb-5">
                      <View className="w-8 h-8 bg-[#0D4F5C]/10 rounded-full items-center justify-center mr-2">
                        <Ionicons name="cash" size={16} color="#0D4F5C" />
                      </View>
                      <Text className="text-[11px] font-black text-text-primary uppercase tracking-tighter">Receita</Text>
                    </View>
                    {clientStats.topByRevenue.map((item, index) => (
                      <View key={index} className="flex-row items-center justify-between mb-4 last:mb-0">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-1.5 h-1.5 bg-[#0D4F5C] rounded-full mr-2" />
                          <Text className="text-text-primary font-bold text-[11px] flex-1" numberOfLines={1}>{item.name}</Text>
                        </View>
                        <Text className="text-[#7BC67A] font-black text-[11px]">R${item.total > 1000 ? (item.total/1000).toFixed(1)+'k' : item.total.toFixed(0)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Resumo de Conversão (PieChart Kit) */}
            {pieChartData.length > 0 && (
              <View className="px-6 mt-8">
                <Text className="text-lg font-black text-text-primary mb-5 px-1">Alocação de Recursos</Text>
                <View className="bg-white pt-6 pb-4 rounded-[40px] shadow-2xl shadow-black/[0.04] items-center">
                  {/* Gráfico sem legendas internas */}
                  <View style={{ width: width - 60, alignItems: 'center', justifyContent: 'center' }}>
                    <PieChart
                      data={pieChartData}
                      width={width - 60}
                      height={200}
                      chartConfig={chartConfig}
                      accessor={"population"}
                      backgroundColor={"transparent"}
                      paddingLeft={"0"}
                      center={[(width - 60) / 4, 0]}
                      absolute
                      hasLegend={false}
                    />
                  </View>

                  {/* Legenda customizada */}
                  <View style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: '#F0F4F5',
                    marginTop: 8,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}>
                    {pieChartData.map((item, index) => {
                      const total = pieChartData.reduce((s, i) => s + i.population, 0);
                      const pct = total > 0 ? Math.round((item.population / total) * 100) : 0;
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#F8FAFB',
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                            gap: 6,
                          }}
                        >
                          <View style={{
                            width: 10, height: 10, borderRadius: 3,
                            backgroundColor: item.color,
                          }} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: '#3A4F55' }} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={{ fontSize: 11, fontWeight: '900', color: item.color }}>
                            {pct}%
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* Contadores Finais */}
            <View className="px-6 mt-8 flex-row gap-4">
              <View className="flex-1 bg-[#7BC67A]/10 p-7 rounded-[32px]">
                <Text className="text-4xl font-black text-[#0D4F5C]">{stats.completed}</Text>
                <Text className="text-text-secondary font-bold text-[11px] uppercase mt-1">CONCLUÍDOS</Text>
              </View>
              <View className="flex-1 bg-[#F0A500]/10 p-7 rounded-[32px]">
                <Text className="text-4xl font-black text-[#0D4F5C]">{stats.pending}</Text>
                <Text className="text-text-secondary font-bold text-[11px] uppercase mt-1">PENDENTES</Text>
              </View>
            </View>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
