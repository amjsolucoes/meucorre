/**
 * Testes do hook useClients
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useClients } from '@/hooks/use-clients';
import { supabase } from '@/lib/supabase';

const mockClients = [
  { id: 'client-1', name: 'Maria Oliveira', phone: '11999990001' }
];

describe('useClients', () => {
  const mockFrom = (data: any, error: any = null) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: data[0], error }) }) }),
    update: jest.fn().mockReturnValue({ eq: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: data[0], error }) }) }) }),
    delete: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error }) }),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data, error }),
    then: jest.fn(resolve => resolve({ data, error }))
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockImplementation(() => mockFrom(mockClients));
  });

  it('deve buscar clientes ao carregar', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clients).toHaveLength(1);
  });

  it('deve adicionar cliente com sucesso', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.addClient({ name: 'Novo', phone: '123' } as any);
    });
    expect(supabase.from).toHaveBeenCalledWith('clients');
  });
});
