import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/** Eyebrow label above a grouped card, e.g. "QUANDO FOI ISSO?" */
export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text className="text-text-secondary font-semibold text-[11px] uppercase tracking-wide mb-2 ml-1">
    {children}
  </Text>
);

/** Statement-style card that groups related rows with hairline dividers, instead of one shadow per row. */
export const GroupedCard = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
    {children}
  </View>
);

interface GroupedRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  text: string;
  /** Show text in muted/hint styling, e.g. for an unselected placeholder */
  muted?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

export const GroupedRow = ({ icon, iconColor, iconBg, text, muted, onPress, isLast }: GroupedRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={0.6}
    className={`flex-row items-center justify-between px-4 py-3.5 ${!isLast ? 'border-b border-border' : ''}`}
    accessibilityLabel={text}
    accessibilityRole={onPress ? 'button' : undefined}
  >
    <View className="flex-row items-center flex-1 mr-3">
      <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: iconBg }}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <Text
        className={`text-[15px] font-semibold flex-1 ${muted ? 'text-text-hint' : 'text-text-primary'}`}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
    {onPress && <Ionicons name="chevron-forward" size={17} color="#C5D0D3" />}
  </TouchableOpacity>
);
