import { useCallback, useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
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
      setError(error.message || 'Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user?.id, fetchAppointments]);

  const addAppointment = async (data: any) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data: inserted, error } = await supabase
      .from('appointments')
      .insert({ ...data, user_id: user.id })
      .select(`*, clients(name)`)
      .single();

    if (error) throw error;

    // Agenda notificação local antes do agendamento — só para status 'scheduled'
    let reminderScheduled = false;
    let reminderRequested = false;
    if (inserted && data.status === 'scheduled') {
      const clientName = inserted.clients?.name ?? 'cliente';
      const isEnabled = data.notification_enabled !== false;

      if (isEnabled) {
        reminderRequested = true;
        const professionMatch = inserted.notes?.match(/^\[Profissão:\s*([^\]]+)\]/);
        const fallbackService = professionMatch ? professionMatch[1] : 'Serviço';

        const reminderId = await scheduleAppointmentReminder(
          inserted.id,
          clientName,
          inserted.service || fallbackService,
          inserted.scheduled_at,
          data.notification_trigger_minutes ?? 60
        );
        reminderScheduled = reminderId !== null;
      }
    }

    fetchAppointments();
    // reminderRequested && !reminderScheduled: usuário pediu lembrete mas ele
    // não foi agendado (permissão negada ou data inválida) — a tela chamadora
    // decide como avisar disso, em vez de deixar passar em silêncio.
    return { appointment: inserted, reminderFailed: reminderRequested && !reminderScheduled };
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
      if (transError) {
        console.error('Erro ao criar transação do agendamento:', transError);
        fetchAppointments();
        // O agendamento já foi marcado como concluído (linha acima), mas o
        // ganho correspondente não foi registrado — isso precisa chegar até
        // a tela, e não só ao console, senão o usuário acha que o valor
        // entrou quando não entrou.
        throw new Error('APPOINTMENT_COMPLETED_TRANSACTION_FAILED');
      }
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
    error,
    fetchAppointments,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
  };
}
