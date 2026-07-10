import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface SaveButtonProps {
  onPress: () => void;
  loading: boolean;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  shadowColor: string;
}

export const SaveButton = ({ onPress, loading, label, icon, colors, shadowColor }: SaveButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.85}
    style={{
      borderRadius: 999,
      overflow: 'hidden',
      marginTop: 24,
      marginBottom: 100,
      shadowColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 5,
    }}
    accessibilityLabel={label}
  >
    <LinearGradient
      colors={loading ? ['#C5D0D3', '#C5D0D3'] : colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 56, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Ionicons name={icon} size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 }}>{label}</Text>
        </>
      )}
    </LinearGradient>
  </TouchableOpacity>
);
