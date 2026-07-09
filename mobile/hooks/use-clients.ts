import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';
import { useCallback, useEffect, useState } from 'react';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  phone_fixed?: string;
  address_street?: string;
  address_number?: string;
  address_neighborhood?: string;
  address_zipcode?: string;
  address_city?: string;
  address_state?: string;
  is_whatsapp?: boolean;
  notes?: string;
  created_at: string;
}

export function useClients() {
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      setError(error.message || 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user?.id, fetchClients]);

  const addClient = async (data: Omit<Client, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    fetchClients();
    return newClient;
  };

  const updateClient = async (id: string, data: Partial<Omit<Client, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) throw new Error('Usuário não autenticado');
    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    fetchClients();
    return updatedClient;
  };

  const deleteClient = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    fetchClients();
  };

  return { clients, loading, error, fetchClients, addClient, updateClient, deleteClient };
}

