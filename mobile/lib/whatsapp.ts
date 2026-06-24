import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

const WHATSAPP_STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/whatsapp-messenger/id310633997',
  android: 'https://play.google.com/store/apps/details?id=com.whatsapp',
  default: 'https://www.whatsapp.com/download',
});

/**
 * Abre o WhatsApp com o número informado.
 * Se o WhatsApp não estiver instalado, redireciona para a loja do dispositivo.
 *
 * @param phone Número do telefone (com ou sem máscara)
 * @param message Mensagem pré-preenchida (opcional)
 */
export async function openWhatsApp(phone: string, message?: string): Promise<void> {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const encodedMessage = message ? `&text=${encodeURIComponent(message)}` : '';
  const whatsappUrl = `whatsapp://send?phone=${phoneWithCountry}${encodedMessage}`;

  const canOpen = await Linking.canOpenURL(whatsappUrl);

  if (canOpen) {
    await Linking.openURL(whatsappUrl);
  } else {
    await Linking.openURL(WHATSAPP_STORE_URL!);
  }
}
