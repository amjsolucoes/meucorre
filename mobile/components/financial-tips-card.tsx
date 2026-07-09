import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinancialTips } from '@/hooks/use-financial-tips';

export function FinancialTipsCard() {
  const { tips, loading } = useFinancialTips();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <View className="px-6 mt-4">
        <View className="bg-white rounded-[35px] p-8 items-center justify-center h-48 shadow-sm border border-gray-50">
          <ActivityIndicator color="#1e40af" />
          <Text className="text-gray-400 font-bold mt-4">Carregando dicas...</Text>
        </View>
      </View>
    );
  }

  if (tips.length === 0) return null;

  const currentTip = tips[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <View className="px-6 mt-8 mb-32">
      <View className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <LinearGradient
          colors={['#1e3a8a', '#1e40af']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-8"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="bg-white/20 p-3 rounded-2xl">
              <Ionicons name={currentTip.icon as any || 'bulb-outline'} size={28} color="white" />
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={handlePrev}
                className="bg-white/10 p-2 rounded-xl"
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityLabel="Dica anterior"
                accessibilityRole="button"
              >
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNext}
                className="bg-white/10 p-2 rounded-xl"
                activeOpacity={0.7}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityLabel="Próxima dica"
                accessibilityRole="button"
              >
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-blue-200 font-black text-xs uppercase tracking-widest mb-2">Dica de Ouro • {currentIndex + 1}/{tips.length}</Text>
          <Text className="text-white font-black text-2xl mb-3 leading-tight">{currentTip.title}</Text>
          <Text className="text-blue-100 font-medium text-lg leading-6">{currentTip.description}</Text>
          
          <View className="flex-row mt-6 space-x-1">
            {tips.map((_, i) => (
              <View 
                key={i} 
                className={`h-1 rounded-full ${i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
