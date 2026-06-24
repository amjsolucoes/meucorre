import mobileAds from 'react-native-google-mobile-ads';

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
 * Configura opções de consentimento (GDPR/CCPA)
 * Importante para conformidade com leis de privacidade
 */
export async function setAdMobConsent(hasConsent: boolean) {
  try {
    const consentInfo = await mobileAds().requestConsentInfoUpdate();

    if (consentInfo.isConsentFormAvailable) {
      await mobileAds().showConsentForm();
    }
  } catch (error) {
    console.error('[AdMob] Erro ao configurar consentimento:', error);
  }
}
