import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/stores/ui';

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
        color: '#7BC67A',
        bg: 'rgba(123,198,122,0.12)',
        buttonBg: '#7BC67A',
        buttonText: '#FFFFFF'
      };
      case 'error': return {
        icon: 'alert-circle',
        color: '#E05555',
        bg: 'rgba(224,85,85,0.10)',
        buttonBg: '#E05555',
        buttonText: '#FFFFFF'
      };
      case 'info': return {
        icon: 'information-circle',
        color: '#0D4F5C',
        bg: 'rgba(13,79,92,0.08)',
        buttonBg: '#0D4F5C',
        buttonText: '#FFFFFF'
      };
      default: return {
        icon: 'checkmark-circle',
        color: '#7BC67A',
        bg: 'rgba(123,198,122,0.12)',
        buttonBg: '#7BC67A',
        buttonText: '#FFFFFF'
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
      <View className="flex-1 justify-center items-center px-8" style={{ backgroundColor: 'rgba(13,30,35,0.6)' }}>
        <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: styles.bg }}
          >
            <Ionicons name={styles.icon as any} size={48} color={styles.color} />
          </View>

          <Text className="text-2xl font-black text-[#1A1A1A] text-center mb-2">
            {title}
          </Text>

          <Text className="text-[#6B7F85] text-center text-lg font-medium mb-8 leading-6">
            {message}
          </Text>

          <View className="w-full gap-3">
            {showCancel && (
              <TouchableOpacity
                onPress={handleCancel}
                activeOpacity={0.8}
                accessibilityLabel={cancelText || 'Cancelar'}
                accessibilityRole="button"
                className="w-full py-5 rounded-[25px] items-center justify-center border border-[#E2E8EA]"
                style={{ backgroundColor: '#F5F7F8' }}
              >
                <Text className="text-[#6B7F85] font-black text-lg uppercase tracking-tighter">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              accessibilityLabel={confirmText || 'Confirmar'}
              accessibilityRole="button"
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
