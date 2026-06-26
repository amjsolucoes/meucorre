/**
 * Traduz erros do Supabase/Postgres para mensagens amigáveis em pt-BR.
 * Regra do projeto: nunca mostrar mensagem técnica para o usuário final —
 * qualquer erro não mapeado cai no fallback genérico (ou customizado).
 */

const DEFAULT_FALLBACK = 'Algo deu errado. Tente novamente.';

const POSTGRES_CODE_MESSAGES: Record<string, string> = {
  '23505': 'Esse registro já existe.',
  '23503': 'Não é possível excluir: existem dados vinculados a este registro.',
  '23502': 'Preencha todos os campos obrigatórios.',
};

const MESSAGE_PATTERNS: { pattern: RegExp; message: string }[] = [
  { pattern: /invalid login credentials/i, message: 'E-mail ou senha incorretos.' },
  { pattern: /user already registered/i, message: 'Esse e-mail já está cadastrado.' },
  { pattern: /email not confirmed/i, message: 'Confirme seu e-mail antes de entrar.' },
  { pattern: /password should be at least/i, message: 'A senha deve ter pelo menos 6 caracteres.' },
  { pattern: /network request failed|network error|fetch failed/i, message: 'Sem conexão com a internet. Verifique sua rede e tente novamente.' },
];

export function getFriendlyErrorMessage(error: unknown, fallback: string = DEFAULT_FALLBACK): string {
  if (!error || typeof error !== 'object') return fallback;

  const code = (error as { code?: unknown }).code;
  if (typeof code === 'string' && POSTGRES_CODE_MESSAGES[code]) {
    return POSTGRES_CODE_MESSAGES[code];
  }

  const message = (error as { message?: unknown }).message;
  if (typeof message === 'string') {
    const match = MESSAGE_PATTERNS.find(({ pattern }) => pattern.test(message));
    if (match) return match.message;
  }

  return fallback;
}
