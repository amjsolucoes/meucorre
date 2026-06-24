import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface FinancialTip {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export function useFinancialTips() {
  const [tips, setTips] = useState<FinancialTip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_tips')
        .select('*');

      if (error) throw error;

      // Randomize the order
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setTips(shuffled);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return { tips, loading, fetchTips };
}
