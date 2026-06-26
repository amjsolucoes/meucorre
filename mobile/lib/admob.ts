import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

/**
 * Inicializa o Google AdMob
 * Deve ser chamado uma vez no início do app
 */
export async function initializeAdMob() {
  try {
    await mobileAds().initialize();
    console.log('[AdMob] Inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('[AdMob] Erro ao inicializar:', error);
    return false;
  }
}

/**
 * Executa o fluxo de consentimento do UMP (GDPR/LGPD): solicita as
 * informações de consentimento e, se necessário, exibe o formulário
 * renderizado pelo Google. Deve ser chamado antes de inicializar o AdMob.
 *
 * @returns `true` se o app pode solicitar anúncios (consentimento obtido
 * ou não exigido para a região do usuário), `false` em caso contrário.
 */
export async function requestAdsConsent(): Promise<boolean> {
  try {
    const consentInfo = await AdsConsent.gatherConsent();
    return consentInfo.canRequestAds;
  } catch (error) {
    console.error('[AdMob] Erro ao obter consentimento:', error);
    return false;
  }
}
