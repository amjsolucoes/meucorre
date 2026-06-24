import { LogoFull } from '@/components/logo';
import { Theme } from '@/constants/theme';
import { useDrawerStore } from '@/stores/drawer';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  icon?: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  hideMenu?: boolean;
  /** Fundo transparente (para telas com gradient hero) */
  transparent?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  showLogo = false,
  icon,
  showBackButton = true,
  rightElement,
  hideMenu = false,
  transparent = false,
}) => {
  const { openDrawer } = useDrawerStore();
  const scaleBack = useRef(new Animated.Value(1)).current;

  const handleBack = () => {
    Animated.sequence([
      Animated.timing(scaleBack, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleBack, { toValue: 1, tension: 200, friction: 8, useNativeDriver: true }),
    ]).start();
    setTimeout(() => router.back(), 80);
  };

  const CircleBtn = ({ onPress, children, label }: { onPress: () => void; children: React.ReactNode; label: string }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 42,
        height: 42,
        backgroundColor: transparent ? 'rgba(255,255,255,0.15)' : '#F5F7F8',
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: transparent ? 'rgba(255,255,255,0.2)' : '#E2E8EA',
      }}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {children}
    </TouchableOpacity>
  );

  const iconColor = transparent ? '#FFFFFF' : Theme.colors.text.primary;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
      }}
    >
      {/* Left */}
      <View style={{ width: 42 }}>
        {showBackButton ? (
          <Animated.View style={{ transform: [{ scale: scaleBack }] }}>
            <CircleBtn onPress={handleBack} label="Voltar">
              <Ionicons name="chevron-back" size={22} color={iconColor} />
            </CircleBtn>
          </Animated.View>
        ) : !hideMenu ? (
          <CircleBtn onPress={openDrawer} label="Abrir menu">
            <Ionicons name="menu" size={22} color={iconColor} />
          </CircleBtn>
        ) : null}
      </View>

      {/* Center */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {showLogo ? (
          <LogoFull 
            size="sm" 
            variant={transparent ? 'white' : 'dark'} 
          />
        ) : (
          <View style={{ alignItems: 'center' }}>
            {icon && (
              <View
                style={{
                  backgroundColor: transparent ? 'rgba(255,255,255,0.2)' : Theme.colors.primary,
                  padding: 6,
                  borderRadius: 10,
                  marginBottom: 2,
                }}
              >
                <Ionicons name={icon as any} size={14} color="white" />
              </View>
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: transparent ? '#FFFFFF' : Theme.colors.text.primary,
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: transparent ? 'rgba(255,255,255,0.65)' : Theme.colors.text.secondary,
                  marginTop: 1,
                  letterSpacing: 0.5,
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Right */}
      <View style={{ width: 42, alignItems: 'flex-end' }}>
        {rightElement || (showLogo ? <View style={{ width: 42 }} /> : null)}
      </View>
    </View>
  );
};
