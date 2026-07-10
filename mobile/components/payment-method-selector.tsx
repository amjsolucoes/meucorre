import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type PaymentMethod = 'pix' | 'cash' | 'card';

const METHODS: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }[] = [
  { id: 'pix', label: 'PIX', icon: 'flash', color: '#0D4F5C', bg: 'rgba(13, 79, 92, 0.08)' },
  { id: 'cash', label: 'DINHEIRO', icon: 'cash', color: '#4C8A4B', bg: 'rgba(76, 138, 75, 0.1)' },
  { id: 'card', label: 'CARTÃO', icon: 'card', color: '#B07A00', bg: 'rgba(176, 122, 0, 0.1)' },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => (
  <View className="flex-row justify-between gap-3">
    {METHODS.map((item) => {
      const isSelected = value === item.id;
      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => onChange(item.id)}
          activeOpacity={0.7}
          className="flex-1 py-3.5 rounded-2xl items-center justify-center border"
          style={{
            backgroundColor: isSelected ? item.color : '#FFFFFF',
            borderColor: isSelected ? item.color : '#E2E8EA',
          }}
          accessibilityLabel={`Forma de pagamento: ${item.label}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <View
            className="w-9 h-9 rounded-full items-center justify-center mb-1.5"
            style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : item.bg }}
          >
            <Ionicons name={item.icon} size={17} color={isSelected ? 'white' : item.color} />
          </View>
          <Text className={`text-[10px] font-bold tracking-wide ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
