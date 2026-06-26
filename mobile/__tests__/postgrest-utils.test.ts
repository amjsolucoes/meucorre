/**
 * Testes do helper de escape de valores para filtros PostgREST (.or/.ilike)
 */
import { escapeIlikeValue } from '@/lib/postgrest-utils';

describe('escapeIlikeValue', () => {
  it('mantém texto simples inalterado', () => {
    expect(escapeIlikeValue('Maria')).toBe('Maria');
  });

  it('escapa aspas duplas para não quebrar o quoting do PostgREST', () => {
    expect(escapeIlikeValue('Maria "Corte"')).toBe('Maria \\"Corte\\"');
  });

  it('escapa barra invertida antes de qualquer outro caractere', () => {
    expect(escapeIlikeValue('a\\b')).toBe('a\\\\b');
  });

  it('não precisa escapar vírgula, ponto ou parênteses (apenas serão envolvidos em aspas pelo chamador)', () => {
    expect(escapeIlikeValue('João, Silva (VIP)')).toBe('João, Silva (VIP)');
  });
});
