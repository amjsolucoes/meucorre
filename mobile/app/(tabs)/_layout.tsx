import { Tabs, useRouter, Redirect } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/auth';

import { MenuDrawer } from '@/components/menu-drawer';

const ADD_BTN_SIZE = 56;

const PlusActions = () => {
  const router = useRouter();
  const scaleIncome = useRef(new Animated.Value(1)).current;
  const scaleExpense = useRef(new Animated.Value(1)).current;

  const pressAnim = (anim: Animated.Value, route: string) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    setTimeout(() => router.push(route as any), 80);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      {/* Botão Ganho */}
      <Animated.View style={{ transform: [{ scale: scaleIncome }] }}>
        <TouchableOpacity
          onPress={() => pressAnim(scaleIncome, '/ganho')}
          style={{
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            borderRadius: ADD_BTN_SIZE / 2,
            backgroundColor: '#7BC67A',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            shadowColor: '#7BC67A',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 12,
            elevation: 10,
            borderWidth: 3,
            borderColor: '#FFFFFF',
          }}
          accessibilityLabel="Novo Ganho"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão Gasto */}
      <Animated.View style={{ transform: [{ scale: scaleExpense }] }}>
        <TouchableOpacity
          onPress={() => pressAnim(scaleExpense, '/gasto')}
          style={{
            width: ADD_BTN_SIZE,
            height: ADD_BTN_SIZE,
            borderRadius: ADD_BTN_SIZE / 2,
            backgroundColor: '#E05555',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
            shadowColor: '#E05555',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.45,
            shadowRadius: 12,
            elevation: 10,
            borderWidth: 3,
            borderColor: '#FFFFFF',
          }}
          accessibilityLabel="Novo Gasto"
          accessibilityRole="button"
        >
          <Ionicons name="remove" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const { session, initialized } = useAuthStore();
  const insets = useSafeAreaInsets();
  const TAB_HEIGHT = 64 + insets.bottom;

  if (!initialized) return null;

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: '#A0B0B5',
          headerShown: false,
          tabBarStyle: {
            height: TAB_HEIGHT,
            paddingBottom: insets.bottom + 4,
            paddingTop: 10,
            borderTopWidth: 0,
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            shadowColor: '#0D4F5C',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 30,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: -4,
            letterSpacing: 0.3,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      width: 28,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: Theme.colors.primary,
                    }}
                  />
                )}
                <Ionicons name={focused ? 'grid' : 'grid-outline'} size={23} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: 'Agenda',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      width: 28,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: Theme.colors.primary,
                    }}
                  />
                )}
                <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={23} color={color} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="plus"
          options={{
            title: '',
            tabBarButton: () => <PlusActions />,
          }}
        />

        <Tabs.Screen
          name="relatorios"
          options={{
            title: 'Relatórios',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      width: 28,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: Theme.colors.primary,
                    }}
                  />
                )}
                <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={23} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="clientes"
          options={{
            title: 'Clientes',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -10,
                      width: 28,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: Theme.colors.primary,
                    }}
                  />
                )}
                <Ionicons name={focused ? 'people' : 'people-outline'} size={23} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
      <MenuDrawer />
    </>
  );
}
