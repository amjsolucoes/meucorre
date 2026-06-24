import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';
import { Profile, useProfileStore } from '../stores/profile';

export type { Profile };

export function useProfile() {
  const { user } = useAuthStore();
  const { profile, setProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('[useProfile] Erro ao buscar perfil:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('Usuário não autenticado');

    // ── Cascade: profissões removidas ────────────────────────────────────────
    // Se o update inclui um novo array de profissões, detecta quais foram removidas
    // e limpa o prefixo [Profissão: X] dos agendamentos futuros que as usavam.
    if (updates.professions && profile?.professions) {
      const currentProfessions: string[] = profile.professions as string[];
      const newProfessions: string[] = updates.professions as string[];
      const removed = currentProfessions.filter(p => !newProfessions.includes(p));

      if (removed.length > 0) {
        // Busca agendamentos futuros (scheduled) que têm [Profissão: X] no notes
        const { data: appointments } = await supabase
          .from('appointments')
          .select('id, notes, service')
          .eq('user_id', user.id)
          .eq('status', 'scheduled');

        if (appointments && appointments.length > 0) {
          const toUpdate: { id: string; notes: string }[] = [];

          for (const apt of appointments) {
            const match = (apt.notes || '').match(/^\[Profissão:\s*([^\]]+)\]/);
            if (!match) continue;

            const professionInNote = match[1];
            if (!removed.includes(professionInNote)) continue;

            // A profissão foi removida — limpa o prefixo do notes.
            // O service (título livre) assume o papel de identificador do serviço.
            const cleanNotes = (apt.notes || '').replace(/^\[Profissão:\s*[^\]]+\]\s*/, '').trim();
            toUpdate.push({ id: apt.id, notes: cleanNotes });
          }

          // Atualiza em paralelo
          if (toUpdate.length > 0) {
            await Promise.all(
              toUpdate.map(({ id, notes }) =>
                supabase
                  .from('appointments')
                  .update({ notes })
                  .eq('id', id)
                  .eq('user_id', user.id)
              )
            );
            console.log(
              `[updateProfile] Cascade: limpou prefixo de profissão em ${toUpdate.length} agendamento(s).`
            );
          }
        }
      }
    }
    // ────────────────────────────────────────────────────────────────────────

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates });
    if (error) throw error;
    await fetchProfile();
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('Usuário não autenticado');
    // Delete profile and all related data first
    await supabase.from('profiles').delete().eq('id', user.id);
    
    // Try to delete user if admin is available (usually not on mobile client)
    try {
      if (supabase.auth.admin) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    } catch (e) {
      console.warn('Could not delete user via admin API:', e);
    }

    // Fallback: sign out
    await supabase.auth.signOut();
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  return { profile, loading, fetchProfile, updateProfile, changePassword, deleteAccount };
}
