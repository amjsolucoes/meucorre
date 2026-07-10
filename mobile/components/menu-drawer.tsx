import { AMJBranding } from '@/components/amj-branding';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import { useDrawerStore } from '@/stores/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    Text, TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);
const DURATION = 280;

interface DrawerItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  iconBg: string;
  iconColor: string;
  onPress: () => void;
  danger?: boolean;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  icon, label, iconBg, iconColor, onPress, danger,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 20, paddingVertical: 9,
          marginHorizontal: 12,
          borderRadius: 14,
          minHeight: 44,
        }}
      >
        <View style={{
          width: 36, height: 36, borderRadius: 10,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: iconBg, marginRight: 13,
        }}>
          <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <Text style={{
          flex: 1, fontSize: 14.5, fontWeight: '600',
          color: danger ? '#E05555' : '#1A1A1A',
        }}>
          {label}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={15}
          color={danger ? '#E05555' : '#C5D0D3'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export const MenuDrawer: React.FC = () => {
  const { isOpen, closeDrawer } = useDrawerStore();
  const { user, signOut } = useAuthStore();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        tension: 70, friction: 12, useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: DURATION, useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, translateX, backdropOpacity]);

  const navigate = (path: string) => {
    closeDrawer();
    setTimeout(() => router.push(path as any), DURATION + 50);
  };

  const handleSignOut = async () => {
    closeDrawer();
    setTimeout(async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        signOut();
        router.replace('/(auth)/login');
      }
    }, DURATION + 50);
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ').slice(0, 2)
    .map((n: string) => n[0] ?? '').join('').toUpperCase() || '?';

  return (
    <View
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      {/* Backdrop */}
      <Animated.View
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13,30,35,0.6)', opacity: backdropOpacity }}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <Pressable style={{ flex: 1 }} onPress={closeDrawer} />
      </Animated.View>

      {/* Drawer Panel */}
      <Animated.View
        style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: DRAWER_WIDTH,
          backgroundColor: '#FFFFFF',
          transform: [{ translateX }],
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          shadowColor: '#000',
          shadowOffset: { width: 8, height: 0 },
          shadowOpacity: 0.2, shadowRadius: 30,
          elevation: 30, borderTopRightRadius: 28, borderBottomRightRadius: 28,
        }}
      >
        {/* Hero section */}
        <LinearGradient
          colors={['#0D4F5C', '#1A6B7A']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 }}
        >
          <TouchableOpacity
            onPress={closeDrawer}
            style={{
              alignSelf: 'flex-end', marginBottom: 10,
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center', justifyContent: 'center',
            }}
            accessibilityLabel="Fechar menu"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Avatar */}
            <View style={{
              width: 52, height: 52, borderRadius: 26,
              backgroundColor: '#7BC67A',
              alignItems: 'center', justifyContent: 'center',
              marginRight: 13,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
              borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 19, fontWeight: '900', letterSpacing: -0.5 }}>{initials}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16.5, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 }} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.62)', marginTop: 1 }} numberOfLines={1}>
                {displayEmail}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 }}>
                <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#7BC67A' }} />
                <Text style={{ color: '#7BC67A', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Conta Ativa
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Items */}
        <View style={{ flex: 1, paddingTop: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 1.4, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 2 }}>
            Minha Conta
          </Text>

          <DrawerItem
            icon="person-outline" label="Editar Perfil"
            iconBg="rgba(13,79,92,0.08)" iconColor="#0D4F5C"
            onPress={() => navigate('/perfil/editar')}
          />
          <DrawerItem
            icon="lock-closed-outline" label="Alterar Senha"
            iconBg="rgba(123,198,122,0.12)" iconColor="#5AA858"
            onPress={() => navigate('/perfil/senha')}
          />

          <View style={{ height: 1, backgroundColor: '#E2E8EA', marginHorizontal: 20, marginVertical: 6 }} />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 1.4, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 2 }}>
            Sessão
          </Text>

          <DrawerItem
            icon="log-out-outline" label="Sair da Conta"
            iconBg="rgba(240,165,0,0.1)" iconColor="#F0A500"
            onPress={handleSignOut}
          />

          <View style={{ height: 1, backgroundColor: '#E2E8EA', marginHorizontal: 20, marginVertical: 6 }} />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#A0B0B5', letterSpacing: 1.4, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 2 }}>
            Legal
          </Text>

          <DrawerItem
            icon="document-text-outline" label="Política de Uso"
            iconBg="rgba(26,107,122,0.08)" iconColor="#1A6B7A"
            onPress={() => navigate('/politica-uso')}
          />
          <DrawerItem
            icon="shield-checkmark-outline" label="Política de Privacidade"
            iconBg="rgba(26,107,122,0.08)" iconColor="#1A6B7A"
            onPress={() => navigate('/politica-privacidade')}
          />

          <View style={{ height: 1, backgroundColor: '#E2E8EA', marginHorizontal: 20, marginVertical: 6 }} />

          <DrawerItem
            icon="trash-outline" label="Excluir Conta"
            iconBg="rgba(224,85,85,0.08)" iconColor="#E05555"
            onPress={() => navigate('/perfil/excluir')}
            danger
          />
        </View>

        {/* Footer */}
        <View style={{
          borderTopWidth: 1, borderTopColor: '#F0F4F5',
          paddingVertical: 8, paddingHorizontal: 20,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <AMJBranding variant="light" />
        </View>
      </Animated.View>
    </View>
  );
};
