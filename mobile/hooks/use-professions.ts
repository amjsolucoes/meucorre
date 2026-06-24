import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Profession {
  id: string;
  name: string;
  icon?: string;
}

// Nomes que devem sempre ficar por último na lista
const LAST_ITEMS = ['outro', 'outros', 'other', 'outros serviços'];

const sortProfessions = (list: Profession[]): Profession[] => {
  const normal = list.filter(p => !LAST_ITEMS.includes(p.name.toLowerCase()));
  const last   = list.filter(p =>  LAST_ITEMS.includes(p.name.toLowerCase()));
  return [...normal, ...last];
};

export function useProfessions() {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('professions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProfessions(sortProfessions(data || []));
    } catch (error) {
      console.error('Error fetching professions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  return { professions, loading, fetchProfessions };
}
