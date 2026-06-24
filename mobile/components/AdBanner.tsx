import { ADMOB_IDS } from '@/constants/admob';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

interface AdBannerProps {
  /**
   * Tamanho do banner
   * - BANNER: 320x50 (padrão)
   * - LARGE_BANNER: 320x100
   * - MEDIUM_RECTANGLE: 300x250
   * - FULL_BANNER: 468x60
   * - LEADERBOARD: 728x90
   */
  size?: 'BANNER' | 'LARGE_BANNER' | 'MEDIUM_RECTANGLE' | 'FULL_BANNER' | 'LEADERBOARD';

  /**
   * Mostrar em telas específicas
   */
  showOnScreen?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'BANNER',
  showOnScreen = true,
}) => {
  const [adError, setAdError] = useState(false);

  if (!showOnScreen || adError) {
    return null;
  }

  return (
    <View className="w-full items-center">
      <BannerAd
        unitId={ADMOB_IDS.banner}
        size={BannerAdSize[size]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['autonomo', 'financas', 'agenda', 'servicos'],
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdBanner] Falha ao carregar anúncio:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};
