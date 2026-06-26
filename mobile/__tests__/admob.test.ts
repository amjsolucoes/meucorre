/**
 * Testes do fluxo de consentimento de anúncios (AdMob/UMP)
 */
import { AdsConsent } from 'react-native-google-mobile-ads';
import { initializeAdMob, requestAdsConsent } from '@/lib/admob';

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: jest.fn(() => ({ initialize: jest.fn().mockResolvedValue(undefined) })),
  AdsConsent: { gatherConsent: jest.fn() },
}));

describe('requestAdsConsent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna true quando o fluxo de consentimento permite anúncios', async () => {
    (AdsConsent.gatherConsent as jest.Mock).mockResolvedValue({ canRequestAds: true });

    const result = await requestAdsConsent();

    expect(result).toBe(true);
    expect(AdsConsent.gatherConsent).toHaveBeenCalled();
  });

  it('retorna false quando o consentimento não permite anúncios', async () => {
    (AdsConsent.gatherConsent as jest.Mock).mockResolvedValue({ canRequestAds: false });

    const result = await requestAdsConsent();

    expect(result).toBe(false);
  });

  it('retorna false (sem lançar) quando o fluxo de consentimento falha', async () => {
    (AdsConsent.gatherConsent as jest.Mock).mockRejectedValue(new Error('falha de rede'));

    const result = await requestAdsConsent();

    expect(result).toBe(false);
  });
});

describe('initializeAdMob', () => {
  it('inicializa o SDK do AdMob com sucesso', async () => {
    const result = await initializeAdMob();

    expect(result).toBe(true);
  });
});
