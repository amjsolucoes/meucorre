/**
 * Testes do hook useProfile
 */
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase';

const mockProfile = { id: 'user-test-123', name: 'Renan' };

describe('useProfile', () => {
  const mockFrom = (data: any, error: any = null) => ({
    select: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error }),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data, error }),
    then: jest.fn(resolve => resolve({ data, error }))
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockImplementation(() => mockFrom(mockProfile));
  });

  it('deve buscar perfil ao carregar', async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toEqual(mockProfile);
  });

  it('deve atualizar perfil com sucesso', async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.updateProfile({ name: 'Novo Nome' });
    });
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });

  it('deve excluir a conta chamando a Edge Function (que tem acesso à service_role) e encerrar a sessão', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { success: true }, error: null });

    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteAccount();
    });

    expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account');
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('deve lançar erro quando a Edge Function de exclusão falha, sem encerrar a sessão', async () => {
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: null, error: { message: 'falhou' } });

    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.deleteAccount()).rejects.toBeTruthy();
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });
});
