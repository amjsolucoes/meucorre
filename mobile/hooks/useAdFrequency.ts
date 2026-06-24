import { useRef } from 'react';

/**
 * Hook para controlar a frequência de anúncios intersticiais
 * 
 * Evita mostrar anúncios com muita frequência, melhorando a experiência do usuário
 * e seguindo as diretrizes do Google AdMob.
 * 
 * @param minIntervalMinutes - Intervalo mínimo entre anúncios (padrão: 3 minutos)
 * 
 * @example
 * ```typescript
 * const { shouldShowAd } = useAdFrequency(5); // 5 minutos entre anúncios
 * const { showAd, loaded } = useInterstitialAd();
 * 
 * const handleAction = async () => {
 *   // Fazer algo...
 *   
 *   if (loaded && shouldShowAd()) {
 *     await showAd();
 *   }
 * };
 * ```
 */
export const useAdFrequency = (minIntervalMinutes: number = 3) => {
  const lastAdTimeRef = useRef<number>(0);
  
  /**
   * Verifica se deve mostrar um anúncio baseado no tempo desde o último anúncio
   * 
   * @returns true se passou tempo suficiente, false caso contrário
   */
  const shouldShowAd = (): boolean => {
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTimeRef.current;
    const minInterval = minIntervalMinutes * 60 * 1000; // Converter para milissegundos
    
    // Se passou tempo suficiente, atualiza o timestamp e retorna true
    if (timeSinceLastAd >= minInterval || lastAdTimeRef.current === 0) {
      lastAdTimeRef.current = now;
      return true;
    }
    
    return false;
  };
  
  /**
   * Reseta o timer (útil para testes ou situações especiais)
   */
  const resetTimer = () => {
    lastAdTimeRef.current = 0;
  };
  
  /**
   * Retorna quanto tempo falta para poder mostrar o próximo anúncio (em minutos)
   */
  const getTimeUntilNextAd = (): number => {
    if (lastAdTimeRef.current === 0) return 0;
    
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTimeRef.current;
    const minInterval = minIntervalMinutes * 60 * 1000;
    const timeRemaining = minInterval - timeSinceLastAd;
    
    return Math.max(0, Math.ceil(timeRemaining / 60000)); // Converter para minutos
  };
  
  return { 
    shouldShowAd, 
    resetTimer,
    getTimeUntilNextAd,
  };
};
