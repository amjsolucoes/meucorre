// Ponto de entrada específico para Web
// Este arquivo evita importar bibliotecas nativas que não funcionam na web

// Mock do react-native-google-mobile-ads para web
if (typeof window !== 'undefined') {
  // Estamos na web, criar mock
  const mockAdMob = {
    BannerAd: () => null,
    InterstitialAd: () => null,
    RewardedAd: () => null,
    RewardedInterstitialAd: () => null,
    AppOpenAd: () => null,
    useInterstitialAd: () => ({
      isLoaded: false,
      isClosed: false,
      load: () => {},
      show: () => {},
      addAdEventListener: () => () => {},
    }),
    useRewardedAd: () => ({
      isLoaded: false,
      isClosed: false,
      load: () => {},
      show: () => {},
      addAdEventListener: () => () => {},
    }),
    BannerAdSize: {
      BANNER: 'BANNER',
      LARGE_BANNER: 'LARGE_BANNER',
      MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
      FULL_BANNER: 'FULL_BANNER',
      LEADERBOARD: 'LEADERBOARD',
      ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
    },
    TestIds: {
      BANNER: 'ca-app-pub-3940256099942544/6300978111',
      INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
      REWARDED: 'ca-app-pub-3940256099942544/5224354917',
    },
    AdEventType: {
      LOADED: 'loaded',
      ERROR: 'error',
      OPENED: 'opened',
      CLOSED: 'closed',
      CLICKED: 'clicked',
    },
    MobileAds: () => ({
      initialize: () => Promise.resolve(),
      setRequestConfiguration: () => {},
    }),
  };

  // Registrar o mock no require cache
  if (typeof require !== 'undefined' && require.cache) {
    const moduleId = 'react-native-google-mobile-ads';
    require.cache[moduleId] = {
      id: moduleId,
      exports: mockAdMob,
      loaded: true,
    };
  }
}

// Importar o app principal
import 'expo-router/entry';
