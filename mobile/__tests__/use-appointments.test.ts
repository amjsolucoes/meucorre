/**
 * Testes do hook useAppointments
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAppointments } from '@/hooks/use-appointments';
import { supabase } from '@/lib/supabase';

const mockApts = [
  { id: 'apt-1', service: 'Corte', status: 'scheduled', amount: 60, clients: { name: 'Maria' } }
];

describe('useAppointments', () => {
  const mockFrom = (data: any, error: any = null) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: data[0], error }) }) }),
    update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error }) }) }),
    delete: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error }) }) }),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data, error }),
    then: jest.fn(resolve => resolve({ data, error }))
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockImplementation(() => mockFrom(mockApts));
  });

  it('deve buscar agendamentos ao carregar', async () => {
    const { result } = renderHook(() => useAppointments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.appointments).toHaveLength(1);
  });

  it('deve adicionar agendamento com sucesso', async () => {
    const { result } = renderHook(() => useAppointments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.addAppointment({ service: 'Teste' } as any);
    });
    expect(supabase.from).toHaveBeenCalledWith('appointments');
  });
});
