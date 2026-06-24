import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/stores/ui';
import { Theme } from '@/constants/theme';

export const AlertModal = () => {
  const { 
    visible, 
    type, 
    title, 
    message, 
    hideAlert, 
    onConfirm, 
    onCancel, 
    showCancel, 
    confirmText, 
    cancelText 
  } = useUIStore();

  if (!visible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success': return { 
        icon: 'checkmark-circle', 
        color: '#4CAF50', 
        bg: '#E8F5E9', 
        buttonBg: '#C8E6C9', // Pastel green
        buttonText: '#2E7D32' 
      };
      case 'error': return { 
        icon: 'alert-circle', 
        color: '#F44336', 
        bg: '#FFEBEE', 
        buttonBg: '#FFCDD2', // Pastel red
        buttonText: '#C62828' 
      };
      case 'info': return { 
        icon: 'information-circle', 
        color: '#2196F3', 
        bg: '#E3F2FD', 
        buttonBg: '#BBDEFB', // Pastel blue
        buttonText: '#1565C0' 
      };
      default: return { 
        icon: 'checkmark-circle', 
        color: '#4CAF50', 
        bg: '#E8F5E9', 
        buttonBg: '#C8E6C9', 
        buttonText: '#2E7D32' 
      };
    }
  };

  const styles = getAlertStyles();

  const handleConfirm = () => {
    hideAlert();
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    hideAlert();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-[#2D3436]/60 justify-center items-center px-8">
        <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: styles.bg }}
          >
            <Ionicons name={styles.icon as any} size={48} color={styles.color} />
          </View>
          
          <Text className="text-2xl font-black text-gray-900 text-center mb-2">
            {title}
          </Text>
          
          <Text className="text-gray-500 text-center text-lg font-medium mb-8 leading-6">
            {message}
          </Text>
          
          <View className="w-full gap-3">
            {showCancel && (
              <TouchableOpacity 
                onPress={handleCancel}
                activeOpacity={0.8}
                className="w-full py-5 rounded-[25px] items-center justify-center border border-gray-100"
                style={{ backgroundColor: '#F8FAFC' }}
              >
                <Text className="text-gray-400 font-black text-lg uppercase tracking-tighter">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="w-full py-5 rounded-[25px] items-center justify-center shadow-sm"
              style={{ backgroundColor: styles.buttonBg }}
            >
              <Text style={{ color: styles.buttonText }} className="font-black text-lg uppercase tracking-tighter">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
