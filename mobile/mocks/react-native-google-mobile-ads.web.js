// Mock do react-native-google-mobile-ads para Web
// Este arquivo simula a biblioteca para que o app funcione na web

// Mock dos componentes
export const BannerAd = () => null;
export const InterstitialAd = () => null;
export const RewardedAd = () => null;
export const RewardedInterstitialAd = () => null;
export const AppOpenAd = () => null;

// Mock dos hooks
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

// Mock dos enums
export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
};

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
};

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
  IMPRESSION: 'impression',
  EARNED_REWARD: 'earned_reward',
};

export const GAMBannerAdSize = BannerAdSize;

export const MaxAdContentRating = {
  G: 'G',
  PG: 'PG',
  T: 'T',
  MA: 'MA',
};

// Mock do MobileAds
export const MobileAds = () => ({
  initialize: () => Promise.resolve(),
  setRequestConfiguration: () => {},
});

// Mock do AdsConsent (UMP não se aplica na web — anúncios web não são exibidos por este SDK)
export const AdsConsent = {
  gatherConsent: () => Promise.resolve({ canRequestAds: false }),
};

export default MobileAds;
