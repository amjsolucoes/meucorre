import { ADMOB_IDS } from '@/constants/admob';
import { useEffect, useState } from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

/**
 * Hook para gerenciar anúncios intersticiais (tela cheia)
 * 
 * Uso recomendado:
 * - Após completar uma ação importante (salvar ganho, marcar agendamento)
 * - Não mostrar mais de 1 vez a cada 3-5 minutos
 * - Nunca interromper fluxos críticos (pagamento, cadastro)
 */
export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(ADMOB_IDS.interstitial, {
      requestNonPersonalizedAdsOnly: false,
      keywords: ['autonomo', 'financas', 'agenda', 'servicos'],
    });

    // Eventos do anúncio
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      // Recarregar o anúncio para a próxima vez
      ad.load();
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      setLoaded(false);
    });

    // Carregar o anúncio
    ad.load();
    setInterstitial(ad);

    // Cleanup
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  /**
   * Mostrar o anúncio se estiver carregado
   */
  const showAd = async () => {
    if (loaded && interstitial) {
      try {
        await interstitial.show();
      } catch (error) {
        // Erro ao mostrar anúncio
      }
    }
  };

  return {
    loaded,
    showAd,
  };
};
