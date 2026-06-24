import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure como as notificações são apresentadas quando o app está em foreground
// shouldShowAlert garante compatibilidade com versões mais antigas do expo-notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true,
  }),
});

/**
 * Solicita permissão para enviar notificações.
 * Retorna true se concedida, false caso contrário.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowCriticalAlerts: false,
      provideAppNotificationSettings: false,
    },
  });
  return status === 'granted';
}

/**
 * Agenda uma notificação local antes do agendamento.
 * Retorna o notificationId que deve ser salvo para cancelamento futuro.
 *
 * @param appointmentId  ID do agendamento (usado como identifier)
 * @param clientName     Nome do cliente
 * @param serviceName    Descrição do serviço
 * @param scheduledAt    Data/hora do agendamento (ISO string)
 * @param triggerMinutes Minutos antes do agendamento para disparar (padrão: 60)
 */
export async function scheduleAppointmentReminder(
  appointmentId: string,
  clientName: string,
  serviceName: string,
  scheduledAt: string,
  triggerMinutes: number = 60
): Promise<string | null> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return null;

  const appointmentDate = new Date(scheduledAt);

  // Valida se a data do agendamento é válida
  if (isNaN(appointmentDate.getTime())) {
    console.warn('[scheduleAppointmentReminder] Data inválida:', scheduledAt);
    return null;
  }

  const reminderDate = new Date(appointmentDate.getTime() - triggerMinutes * 60 * 1000);

  // Garante uma margem mínima de 5 segundos no futuro para evitar disparo imediato
  const now = new Date();
  const minimumFutureDate = new Date(now.getTime() + 5000);
  if (reminderDate <= minimumFutureDate) {
    console.warn(
      `[scheduleAppointmentReminder] Lembrete já passou ou muito próximo. ` +
      `Agendamento: ${appointmentDate.toISOString()}, Lembrete: ${reminderDate.toISOString()}`
    );
    return null;
  }

  // Cancela notificação anterior com o mesmo ID (segurança para reagendamento)
  await cancelAppointmentReminder(appointmentId);

  const formatMinutesMessage = (mins: number) => {
    if (mins === 5) return 'Daqui a 5 minutos você tem compromisso!';
    if (mins === 30) return 'Daqui a 30 minutos você tem compromisso!';
    return 'Daqui a 1 hora você tem compromisso!';
  };

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: `appointment-${appointmentId}`,
      content: {
        title: `🔔 ${formatMinutesMessage(triggerMinutes)}`,
        body: `${serviceName} com ${clientName}`,
        data: { appointmentId },
        sound: true,
        ...(Platform.OS === 'android' && {
          channelId: 'appointments',
          vibrate: [0, 250, 250, 250],
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });

    console.log(
      `[scheduleAppointmentReminder] Notificação agendada: ${notificationId} ` +
      `para ${reminderDate.toLocaleString('pt-BR')} (${triggerMinutes}min antes de ${appointmentDate.toLocaleString('pt-BR')})`
    );

    return notificationId;
  } catch (err) {
    console.error('[scheduleAppointmentReminder] Erro ao agendar notificação:', err);
    return null;
  }
}

/**
 * Cancela a notificação agendada para um agendamento específico.
 * @param appointmentId  ID do agendamento
 */
export async function cancelAppointmentReminder(appointmentId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(`appointment-${appointmentId}`);
    console.log(`[cancelAppointmentReminder] Notificação cancelada: appointment-${appointmentId}`);
  } catch (err) {
    // Silencia se não existir — é esperado em alguns casos
  }
}

/**
 * Cancela TODAS as notificações de agendamentos pendentes.
 * Útil ao fazer logout.
 */
export async function cancelAllAppointmentReminders(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const appointmentNotifications = scheduled.filter((n) =>
    n.identifier.startsWith('appointment-')
  );
  await Promise.all(
    appointmentNotifications.map((n) =>
      Notifications.cancelScheduledNotificationAsync(n.identifier)
    )
  );
}

/**
 * Cria o canal de notificações para Android (obrigatório no Android 8+).
 * Deve ser chamado uma vez na inicialização do app.
 */
export async function setupAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('appointments', {
    name: 'Agendamentos',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4D5DFB',
    description: 'Lembretes de agendamentos antes do horário marcado',
    sound: 'default',
    enableVibrate: true,
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

/**
 * Utilitário de debug: lista todas as notificações agendadas no console.
 * Útil para verificar se as notificações estão sendo agendadas corretamente.
 */
export async function debugListScheduledNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduled.length === 0) {
    console.log('[debugNotifications] Nenhuma notificação agendada.');
    return;
  }
  console.log(`[debugNotifications] ${scheduled.length} notificação(ões) agendada(s):`);
  scheduled.forEach((n) => {
    const trigger = n.trigger as any;
    const fireDate = trigger?.value
      ? new Date(trigger.value * 1000).toLocaleString('pt-BR')
      : trigger?.date
        ? new Date(trigger.date).toLocaleString('pt-BR')
        : 'desconhecido';
    console.log(`  - ${n.identifier}: dispara em ${fireDate}`);
  });
}
