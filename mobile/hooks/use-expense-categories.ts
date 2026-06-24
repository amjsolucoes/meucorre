import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export function useExpenseCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const sorted = (data || []).sort((a, b) => {
        if (a.name.toLowerCase() === 'outros') return 1;
        if (b.name.toLowerCase() === 'outros') return -1;
        return 0;
      });
      setCategories(sorted);
    } catch (error) {
      console.error('Error fetching expense categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    refreshCategories: fetchCategories
  };
}
