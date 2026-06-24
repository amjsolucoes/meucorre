import { Platform } from 'react-native';

/**
 * IDs do Google AdMob
 *
 * App ID Android (produção): ca-app-pub-3912743282778596~7066626902
 *
 * NUNCA publique o app com IDs de teste, sua conta pode ser banida!
 */

// IDs de TESTE (usar apenas em desenvolvimento)
const TEST_IDS = {
  ios: {
    banner: 'ca-app-pub-3940256099942544/9214589741',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
  },
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
  },
};

// IDs de PRODUÇÃO
const PRODUCTION_IDS = {
  ios: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Substituir pelo ID iOS real
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Substituir pelo ID iOS real
  },
  android: {
    banner: 'ca-app-pub-3912743282778596/2281204087',
    interstitial: 'ca-app-pub-3912743282778596/4328699805',
  },
};

// Usar IDs de teste em desenvolvimento, produção quando publicar
const USE_TEST_IDS = __DEV__; // true em desenvolvimento, false em produção

const ADS = USE_TEST_IDS ? TEST_IDS : PRODUCTION_IDS;

export const ADMOB_IDS = {
  banner: Platform.select({
    ios: ADS.ios.banner,
    android: ADS.android.banner,
  }) as string,
  interstitial: Platform.select({
    ios: ADS.ios.interstitial,
    android: ADS.android.interstitial,
  }) as string,
};
