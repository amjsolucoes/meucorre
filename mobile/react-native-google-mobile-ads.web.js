// Mock completo do react-native-google-mobile-ads para Web
// Este arquivo substitui a biblioteca nativa quando rodando na web

// Componentes
export const BannerAd = () => null;
export const InterstitialAd = () => null;
export const RewardedAd = () => null;
export const RewardedInterstitialAd = () => null;
export const AppOpenAd = () => null;
export const GAMBannerAd = () => null;
export const GAMInterstitialAd = () => null;

// Hooks
export const useInterstitialAd = () => ({
  isLoaded: false,
  isClosed: false,
  load: () => {},
  show: () => {},
  addAdEventListener: () => () => {},
});

export const useRewardedAd = () => ({
  isLoaded: false,
  isClosed: false,
  load: () => {},
  show: () => {},
  addAdEventListener: () => () => {},
});

export const useRewardedInterstitialAd = () => ({
  isLoaded: false,
  isClosed: false,
  load: () => {},
  show: () => {},
  addAdEventListener: () => () => {},
});

export const useAppOpenAd = () => ({
  isLoaded: false,
  isClosed: false,
  load: () => {},
  show: () => {},
  addAdEventListener: () => () => {},
});

// Enums e constantes
export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  INLINE_ADAPTIVE_BANNER: 'INLINE_ADAPTIVE_BANNER',
  SMART_BANNER: 'SMART_BANNER',
};

export const GAMBannerAdSize = BannerAdSize;

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
  GAM_BANNER: 'ca-app-pub-3940256099942544/6300978111',
  GAM_INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
};

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
  IMPRESSION: 'impression',
  EARNED_REWARD: 'earned_reward',
  LEFT_APPLICATION: 'left_application',
};

export const RewardedAdEventType = AdEventType;
export const AppOpenAdEventType = AdEventType;

export const MaxAdContentRating = {
  G: 'G',
  PG: 'PG',
  T: 'T',
  MA: 'MA',
};

export const AdsConsent = {
  requestInfoUpdate: () => Promise.resolve(),
  showForm: () => Promise.resolve(),
  getConsentInfo: () => Promise.resolve({
    status: 'OBTAINED',
    isConsentFormAvailable: false,
  }),
  reset: () => {},
  loadAndShowConsentFormIfRequired: () => Promise.resolve(),
};

export const AdsConsentStatus = {
  UNKNOWN: 'UNKNOWN',
  REQUIRED: 'REQUIRED',
  NOT_REQUIRED: 'NOT_REQUIRED',
  OBTAINED: 'OBTAINED',
};

export const AdsConsentDebugGeography = {
  DISABLED: 'DISABLED',
  EEA: 'EEA',
  NOT_EEA: 'NOT_EEA',
};

// MobileAds
const mobileAds = {
  initialize: () => Promise.resolve(),
  setRequestConfiguration: () => {},
  openAdInspector: () => Promise.resolve(),
};

export const MobileAds = () => mobileAds;

export default mobileAds;
