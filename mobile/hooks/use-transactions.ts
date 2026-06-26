import { useCallback, useEffect, useState } from 'react';
import { escapeIlikeValue } from '../lib/postgrest-utils';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  startDate?: string;
  endDate?: string;
  clientId?: string;
  search?: string;
  status?: 'concluido' | 'pendente' | 'all';
}

export function useTransactions(initialFilters: TransactionFilters = { type: 'all' }) {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      setLoading(true);
      let query = supabase
        .from('transactions')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }

      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        const term = escapeIlikeValue(filters.search);
        query = query.or(`title.ilike."%${term}%",description.ilike."%${term}%"`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('[useTransactions] Erro ao buscar transações:', error.message || error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters]);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id, fetchTransactions]);

  const addTransaction = async (data: {
    type: 'income' | 'expense';
    amount: number;
    title: string;
    description?: string;
    category?: string;
    payment_method?: 'cash' | 'pix' | 'card';
    client_id?: string;
    date?: string;
    status?: 'concluido' | 'pendente';
  }) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase.from('transactions').insert({
      ...data,
      user_id: user.id,
    });

    if (error) throw error;
    fetchTransactions();
  };

  const deleteTransaction = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    fetchTransactions();
  };

  const updateTransaction = async (id: string, updates: {
    amount?: number;
    title?: string;
    description?: string;
    status?: 'concluido' | 'pendente';
  }) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    fetchTransactions();
  };

  return { 
    transactions, 
    loading, 
    fetchTransactions, 
    addTransaction,
    deleteTransaction,
    updateTransaction,
    filters,
    setFilters
  };
}

