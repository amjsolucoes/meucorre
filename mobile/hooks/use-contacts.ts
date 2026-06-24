import * as Contacts from 'expo-contacts';
import { useCallback, useState } from 'react';

export interface PhoneContact {
  id: string;
  name: string;
  phone: string;
  isWhatsApp: boolean; // padrão false — usuário pode marcar depois
}

export function useContacts() {
  const [contacts, setContacts] = useState<PhoneContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Contacts.PermissionStatus | null>(null);

  const requestAndLoad = useCallback(async (): Promise<'granted' | 'denied' | 'unavailable'> => {
    setLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setLoading(false);
        return status === 'denied' ? 'denied' : 'unavailable';
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        sort: Contacts.SortTypes.FirstName,
      });

      // Filtra contatos que têm nome e pelo menos um telefone
      const mapped: PhoneContact[] = [];
      for (const contact of data) {
        if (!contact.name || !contact.phoneNumbers?.length) continue;

        // Pega o primeiro número disponível, limpa a máscara
        const rawPhone = contact.phoneNumbers[0].number ?? '';
        const cleanPhone = rawPhone.replace(/\D/g, '');

        // Ignora números muito curtos (inválidos)
        if (cleanPhone.length < 8) continue;

        // Formata como (XX) XXXXX-XXXX se tiver DDD
        let formattedPhone = rawPhone.trim();
        if (cleanPhone.length === 11) {
          formattedPhone = `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
        } else if (cleanPhone.length === 10) {
          formattedPhone = `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
        }

        mapped.push({
          id: contact.id ?? String(Math.random()),
          name: contact.name,
          phone: formattedPhone,
          isWhatsApp: false,
        });
      }

      setContacts(mapped);
      return 'granted';
    } catch (err) {
      console.error('[useContacts] Erro ao carregar contatos:', err);
      return 'unavailable';
    } finally {
      setLoading(false);
    }
  }, []);

  return { contacts, loading, permissionStatus, requestAndLoad };
}
