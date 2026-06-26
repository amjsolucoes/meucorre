/**
 * Testes do hook useTransactions
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTransactions } from '@/hooks/use-transactions';
import { supabase } from '@/lib/supabase';

const mockTransactions = [
  { id: 'tx-1', user_id: 'user-test-123', type: 'income', amount: 150, title: 'Corte', date: '2026-05-10', status: 'concluido' }
];

describe('useTransactions', () => {
  const mockFrom = (data: any, error: any = null) => {
    const chain: any = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      then: jest.fn(resolve => resolve({ data, error }))
    };
    return chain;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockImplementation(() => mockFrom(mockTransactions));
  });

  it('deve buscar transações ao carregar', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 2000 });
    expect(result.current.transactions).toEqual(mockTransactions);
  });

  it('deve adicionar transação com sucesso', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addTransaction({ type: 'income', amount: 100, title: 'Teste' });
    });

    expect(supabase.from).toHaveBeenCalledWith('transactions');
  });

  it('deve deletar transação com sucesso', async () => {
    const { result } = renderHook(() => useTransactions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteTransaction('tx-1');
    });

    expect(supabase.from).toHaveBeenCalledWith('transactions');
  });

  it('escapa e envolve em aspas o termo de busca para não quebrar o filtro PostgREST', async () => {
    const search = 'João, "VIP" (cliente)';
    const { result } = renderHook(() => useTransactions({ type: 'all', search }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const chain = (supabase.from as jest.Mock).mock.results[0].value;
    expect(chain.or).toHaveBeenCalledWith(
      'title.ilike."%João, \\"VIP\\" (cliente)%",description.ilike."%João, \\"VIP\\" (cliente)%"'
    );
  });
});
