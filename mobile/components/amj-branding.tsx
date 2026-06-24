import React from 'react';
import { Image, View } from 'react-native';

interface AMJBrandingProps {
  /**
   * Use 'light' for light backgrounds (renders gray logo).
   * Use 'dark' for dark backgrounds (renders white logo).
   * @default 'light'
   */
  variant?: 'light' | 'dark';
}

/**
 * AMJBranding Component
 * Displays a small and subtle logo of AMJ, informing that the app was developed by them.
 */
export const AMJBranding: React.FC<AMJBrandingProps> = ({ variant = 'light' }) => {
  const logoSource = variant === 'dark'
    ? require('../assets/logo-amj-branca.png')
    : require('../assets/logo-amj-cinza.png');

  return (
    <View className="items-center justify-center py-6">
      <Image
        source={logoSource}
        className="w-[120px] h-[48px]"
        resizeMode="contain"
        accessible={false}
      />
    </View>
  );
};
