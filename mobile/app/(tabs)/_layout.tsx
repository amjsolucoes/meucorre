import { Redirect, Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth';
import { MenuDrawer } from '@/components/menu-drawer';

// ── Ícone de aba com indicador de aba ativa ──────────────────────
// Reusa a linguagem visual do "dot vira pill" já definida em
// designer.md §5.8 (Progress Indicator) como indicador de aba ativa.
const TabIcon: React.FC<{
  name: React.ComponentProps<typeof Ionicons>['name'];
  focusedName: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}> = ({ name, focusedName, color, focused }) => (
  <View className="items-center justify-center">
    <Ionicons name={focused ? focusedName : name} size={22} color={color} />
    <View
      className={`mt-0.5 h-[3px] w-4 rounded-full ${focused ? 'bg-[#0D4F5C]' : 'bg-transparent'}`}
    />
  </View>
);

// ── FAB central (via tabBarButton — sem overlay duplicado) ──────
const CenterFAB: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 220, friction: 8, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: Theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            shadowColor: Theme.colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 12,
            borderWidth: 3,
            borderColor: '#FFFFFF',
          }}
          accessibilityLabel="Novo lançamento"
          accessibilityRole="button"
          accessibilityHint="Abre opções para registrar ganho ou gasto"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ── Bottom Sheet ganho / gasto ──────────────────────────────────
const IncomeExpenseSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  tabHeight: number;
}> = ({ visible, onClose, onNavigate, tabHeight }) => {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  // Começa bem abaixo da tela (valor de segurança) até medirmos a altura
  // real do conteúdo via onLayout — um offset fixo (300) ficava menor que
  // a altura real do sheet (paddingBottom já inclui tabHeight+8), deixando
  // uma fatia do painel visível por cima do label da tab bar mesmo fechado.
  const slideY = useRef(new Animated.Value(500)).current;
  const sheetHeight = useRef(500);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideY, { toValue: 0, tension: 100, friction: 12, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: sheetHeight.current, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, backdropOpacity, slideY]);

  const handleLayout = (e: { nativeEvent: { layout: { height: number } } }) => {
    const measured = e.nativeEvent.layout.height;
    if (measured > 0 && measured !== sheetHeight.current) {
      sheetHeight.current = measured;
      if (!visible) slideY.setValue(measured);
    }
  };

  return (
    <View
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9990 }}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13,25,30,0.55)', opacity: backdropOpacity }}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        onLayout={handleLayout}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingTop: 14,
          paddingHorizontal: 24,
          paddingBottom: tabHeight + 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.1,
          shadowRadius: 24,
          elevation: 24,
          transform: [{ translateY: slideY }],
        }}
      >
        <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: '#D8E0E3', alignSelf: 'center', marginBottom: 22 }} />

        <Text style={{ fontSize: 11, fontWeight: '800', color: '#A0B0B5', textAlign: 'center', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 20 }}>
          Registrar
        </Text>

        <View style={{ flexDirection: 'row', gap: 14, paddingBottom: 8 }}>
          {/* Ganho */}
          <TouchableOpacity
            onPress={() => onNavigate('/ganho')}
            activeOpacity={0.82}
            accessibilityLabel="Novo Ganho"
            accessibilityRole="button"
            style={{ flex: 1, backgroundColor: '#F4FCF5', borderRadius: 24, padding: 22, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(123,198,122,0.28)', shadowColor: '#7BC67A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 5 }}
          >
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#7BC67A', alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#7BC67A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 }}>
              <Ionicons name="trending-up" size={28} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 }}>Ganho</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#7BC67A' }}>Nova receita</Text>
          </TouchableOpacity>

          {/* Gasto */}
          <TouchableOpacity
            onPress={() => onNavigate('/gasto')}
            activeOpacity={0.82}
            accessibilityLabel="Novo Gasto"
            accessibilityRole="button"
            style={{ flex: 1, backgroundColor: '#FFF4F4', borderRadius: 24, padding: 22, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(224,85,85,0.2)', shadowColor: '#E05555', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 5 }}
          >
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E05555', alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: '#E05555', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 }}>
              <Ionicons name="trending-down" size={28} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 }}>Gasto</Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#E05555' }}>Nova despesa</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ── Layout principal ────────────────────────────────────────────
export default function TabLayout() {
  const { session, initialized } = useAuthStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Piso de segurança: no Android com edge-to-edge (app.config.js tem
  // edgeToEdgeEnabled: true), insets.bottom pode chegar como 0 mesmo
  // havendo barra de gestos do sistema (~24dp) sobrepondo a tela — sem
  // esse piso, o label da aba fica escondido atrás da barra do sistema
  // mesmo com o ícone visível acima dela.
  const bottomInset = Math.max(insets.bottom, 20);
  // 68px de base (acima do mínimo de 64px em designer.md §6 "Bottom
  // Navigation Bar") pra sobrar respiro real com o label maior (11px) e
  // não depender de um cálculo justo.
  const TAB_HEIGHT = 68 + bottomInset;

  const [actionSheetVisible, setActionSheetVisible] = useState(false);

  const navigate = (path: string) => {
    setActionSheetVisible(false);
    setTimeout(() => router.push(path as any), 180);
  };

  if (!initialized) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: Theme.colors.text.secondary,
          headerShown: false,
          tabBarStyle: {
            height: TAB_HEIGHT,
            paddingBottom: bottomInset + 10,
            paddingTop: 8,
            borderTopWidth: 0,
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            shadowColor: '#0D2B33',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 24,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.1,
            marginTop: 3,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="grid-outline" focusedName="grid" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="calendar-outline" focusedName="calendar" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="plus"
          options={{
            title: '',
            tabBarButton: () => (
              <CenterFAB onPress={() => setActionSheetVisible((v) => !v)} />
            ),
          }}
        />
        <Tabs.Screen
          name="relatorios"
          options={{
            title: 'Relatórios',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="bar-chart-outline" focusedName="bar-chart" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="clientes"
          options={{
            title: 'Clientes',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="people-outline" focusedName="people" color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>

      <MenuDrawer />

      <IncomeExpenseSheet
        visible={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        onNavigate={navigate}
        tabHeight={TAB_HEIGHT}
      />
    </>
  );
}
