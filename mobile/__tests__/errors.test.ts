/**
 * Testes do mapeador de erros amigáveis (nunca expor mensagem técnica ao usuário)
 */
import { getFriendlyErrorMessage } from '@/lib/errors';

describe('getFriendlyErrorMessage', () => {
  it('mapeia violação de unicidade do Postgres (23505)', () => {
    expect(getFriendlyErrorMessage({ code: '23505', message: 'duplicate key value violates unique constraint "clients_phone_key"' }))
      .toBe('Esse registro já existe.');
  });

  it('mapeia violação de chave estrangeira do Postgres (23503)', () => {
    expect(getFriendlyErrorMessage({ code: '23503', message: 'update or delete on table "clients" violates foreign key constraint' }))
      .toBe('Não é possível excluir: existem dados vinculados a este registro.');
  });

  it('mapeia campo obrigatório do Postgres (23502)', () => {
    expect(getFriendlyErrorMessage({ code: '23502', message: 'null value in column "name" violates not-null constraint' }))
      .toBe('Preencha todos os campos obrigatórios.');
  });

  it('mapeia credenciais inválidas do Supabase Auth', () => {
    expect(getFriendlyErrorMessage({ message: 'Invalid login credentials' }))
      .toBe('E-mail ou senha incorretos.');
  });

  it('mapeia e-mail já cadastrado do Supabase Auth', () => {
    expect(getFriendlyErrorMessage({ message: 'User already registered' }))
      .toBe('Esse e-mail já está cadastrado.');
  });

  it('mapeia falha de rede', () => {
    expect(getFriendlyErrorMessage({ message: 'Network request failed' }))
      .toBe('Sem conexão com a internet. Verifique sua rede e tente novamente.');
  });

  it('nunca expõe mensagem técnica desconhecida — usa fallback genérico', () => {
    expect(getFriendlyErrorMessage({ code: '42601', message: 'syntax error at or near "SELECT"' }))
      .toBe('Algo deu errado. Tente novamente.');
  });

  it('usa o fallback customizado quando fornecido e o erro é desconhecido', () => {
    expect(getFriendlyErrorMessage({ message: 'boom' }, 'Não foi possível salvar o cliente.'))
      .toBe('Não foi possível salvar o cliente.');
  });

  it('não quebra com entrada nula/indefinida', () => {
    expect(getFriendlyErrorMessage(null)).toBe('Algo deu errado. Tente novamente.');
    expect(getFriendlyErrorMessage(undefined)).toBe('Algo deu errado. Tente novamente.');
  });
});
