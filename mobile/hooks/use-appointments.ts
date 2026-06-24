import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth';
import {
    cancelAppointmentReminder,
    scheduleAppointmentReminder,
} from './use-notifications';

export function useAppointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('[useAppointments] Erro ao buscar agendamentos:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id]);

  const addAppointment = async (data: any) => {
    if (!user) throw new Error('Usuário não autenticado');

    let { data: inserted, error } = await supabase
      .from('appointments')
      .insert({ ...data, user_id: user.id })
      .select(`*, clients(name)`)
      .single();

    // Se der erro de coluna inexistente (banco ainda não migrado), tenta inserir sem elas
    if (error && (error.message?.includes('column') || error.code === 'PGRST204' || error.hint?.includes('column') || error.message?.includes('not found'))) {
      console.warn('Colunas de notificação não encontradas no banco. Inserindo sem elas.');
      
      const cleanData = { ...data };
      delete cleanData.notification_enabled;
      delete cleanData.notification_trigger_minutes;

      const retryResult = await supabase
        .from('appointments')
        .insert({ ...cleanData, user_id: user.id })
        .select(`*, clients(name)`)
        .single();
      
      inserted = retryResult.data;
      error = retryResult.error;
    }

    if (error) throw error;

    // Agenda notificação local antes do agendamento — só para status 'scheduled'
    if (inserted && data.status === 'scheduled') {
      const clientName = inserted.clients?.name ?? 'cliente';
      const isEnabled = data.notification_enabled !== false;

      if (isEnabled) {
        const professionMatch = inserted.notes?.match(/^\[Profissão:\s*([^\]]+)\]/);
        const fallbackService = professionMatch ? professionMatch[1] : 'Serviço';

        await scheduleAppointmentReminder(
          inserted.id,
          clientName,
          inserted.service || fallbackService,
          inserted.scheduled_at,
          data.notification_trigger_minutes ?? 60
        );
      }
    }

    fetchAppointments();
  };

  const updateAppointmentStatus = async (
    id: string,
    status: 'scheduled' | 'completed' | 'cancelled',
    amount?: number,
    description?: string,
    clientId?: string
  ) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    // Cancela lembrete se o compromisso foi concluído ou cancelado
    if (status === 'completed' || status === 'cancelled') {
      await cancelAppointmentReminder(id);
    }

    // Se for concluído e tiver valor, cria uma transação de ganho
    if (status === 'completed' && amount && amount > 0) {
      const { error: transError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'income',
        amount: amount,
        title: `Atendimento: ${description || 'Serviço'}`,
        description: `Agendamento concluído em ${new Date().toLocaleDateString('pt-BR')}`,
        client_id: clientId,
        date: new Date().toISOString().split('T')[0],
        status: 'concluido',
      });
      if (transError) console.error('Erro ao criar transação do agendamento:', transError);
    }

    fetchAppointments();
  };

  const deleteAppointment = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    // Cancela o lembrete antes de deletar o registro
    await cancelAppointmentReminder(id);

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    fetchAppointments();
  };

  return {
    appointments,
    loading,
    fetchAppointments,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  };
}
