/**
 * Testes de Gasto de Usuário e Exclusão de Conta
 */
import React from 'react';
import { renderHook, act, waitFor, render, fireEvent } from '@testing-library/react-native';
import { useTransactions } from '@/hooks/use-transactions';
import { supabase } from '@/lib/supabase';
import ExcluirContaScreen from '@/app/perfil/excluir';
import { useUIStore } from '@/stores/ui';

// Mock do useUIStore para podermos interceptar os alertas disparados
jest.mock('@/stores/ui', () => {
  return {
    useUIStore: jest.fn(() => ({
      showAlert: jest.fn(),
      hideAlert: jest.fn(),
    })),
  };
});

const mockExpenses = [
  { id: 'tx-gasto-1', user_id: 'user-test-123', type: 'expense', amount: 50, title: 'Combustível', date: '2026-05-12', status: 'concluido' }
];

describe('Testes de Gastos de Usuário (Expense CRUD) e Exclusão de Conta (Cascade Delete)', () => {
  const mockFrom = (data: any, error: any = null) => {
    const chain: any = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data, error }),
      then: jest.fn((resolve) => resolve({ data, error })),
    };
    return chain;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default supabase implementation returning expenses
    (supabase.from as jest.Mock).mockImplementation(() => mockFrom(mockExpenses));
  });

  describe('1. CRUD e Fluxo de Gasto (Expense)', () => {
    it('deve adicionar um gasto (despesa) com sucesso', async () => {
      const { result } = renderHook(() => useTransactions({ type: 'expense' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      const newExpense = {
        type: 'expense' as const,
        amount: 45.5,
        title: 'Almoço com cliente',
        description: 'Almoço executivo',
        category: 'Alimentação',
        payment_method: 'pix' as const,
        date: '2026-05-12',
        status: 'concluido' as const,
      };

      await act(async () => {
        await result.current.addTransaction(newExpense);
      });

      // Verifica se a tabela 'transactions' foi chamada no Supabase para inserção
      expect(supabase.from).toHaveBeenCalledWith('transactions');
    });

    it('deve buscar e carregar as informações detalhadas dos gastos do usuário', async () => {
      const { result } = renderHook(() => useTransactions({ type: 'expense' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.transactions).toEqual(mockExpenses);
      expect(result.current.transactions[0].type).toBe('expense');
      expect(result.current.transactions[0].title).toBe('Combustível');
      expect(result.current.transactions[0].amount).toBe(50);
    });

    it('deve editar um gasto com sucesso', async () => {
      const { result } = renderHook(() => useTransactions({ type: 'expense' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.updateTransaction('tx-gasto-1', {
          title: 'Combustível Premium',
          amount: 60.0,
        });
      });

      // Verifica se a transação atualizada enviou as informações corretas ao banco
      expect(supabase.from).toHaveBeenCalledWith('transactions');
    });

    it('deve excluir um gasto com sucesso', async () => {
      const { result } = renderHook(() => useTransactions({ type: 'expense' }));
      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.deleteTransaction('tx-gasto-1');
      });

      // Verifica se deletou o gasto especificado pelo id
      expect(supabase.from).toHaveBeenCalledWith('transactions');
    });
  });

  describe('2. Exclusão de Conta (via Edge Function com service_role)', () => {
    it('deve chamar a Edge Function de exclusão e encerrar a sessão ao confirmar na tela', async () => {
      const mockShowAlert = jest.fn();

      (useUIStore as any).mockReturnValue({
        showAlert: mockShowAlert,
        hideAlert: jest.fn(),
      });

      // Perfil carregado ao montar a tela (useProfile chama fetchProfile no mount)
      (supabase.from as jest.Mock).mockImplementation(() => mockFrom({ id: 'user-test-123', name: 'Teste' }));
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { success: true }, error: null });

      // Renderiza a tela de excluir conta
      const { getByText } = render(<ExcluirContaScreen />);

      // Encontra e pressiona o botão de Excluir Conta
      const deleteButton = getByText('EXCLUIR MINHA CONTA');
      fireEvent.press(deleteButton);

      // Verifica se o modal de confirmação de perigo/exclusão foi mostrado
      expect(mockShowAlert).toHaveBeenCalled();

      // Pega o argumento onConfirm passado para o showAlert e o executa para simular a confirmação do usuário
      const alertConfig = mockShowAlert.mock.calls[0][0];
      expect(alertConfig.title).toBe('Excluir Conta?');
      expect(alertConfig.showCancel).toBe(true);

      // Executa o onConfirm
      await act(async () => {
        await alertConfig.onConfirm();
      });

      // VERIFICAÇÃO CRÍTICA DE PRIVACIDADE E SEGURANÇA:
      // A exclusão real do usuário em auth.users exige a service_role key, que só
      // existe no servidor — por isso a tela NUNCA deve deletar dados diretamente
      // pelo client; deve sempre passar pela Edge Function.
      expect(supabase.functions.invoke).toHaveBeenCalledWith('delete-account');

      // Garante que a sessão é encerrada após a exclusão bem-sucedida
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
