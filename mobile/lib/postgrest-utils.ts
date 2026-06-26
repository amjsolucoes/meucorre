/**
 * Escapa um valor de texto livre para uso seguro dentro de um filtro PostgREST
 * (ex: .or(`title.ilike."%${escapeIlikeValue(term)}%"`)).
 *
 * O PostgREST trata vírgula, ponto e parênteses como delimitadores de sintaxe;
 * a forma documentada de incluí-los literalmente é envolver o valor em aspas
 * duplas. Dentro de um valor entre aspas, apenas a própria aspa dupla e a
 * barra invertida precisam ser escapadas (com barra invertida).
 */
export function escapeIlikeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
