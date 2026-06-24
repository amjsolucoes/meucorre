import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Hook de paginação local para listas grandes.
 * Recebe um array completo e expõe fatias incrementais conforme o usuário rola.
 *
 * @param data       Array completo de itens já carregados
 * @param pageSize   Quantos itens carregar por vez (padrão: 20)
 * @param resetKey   Qualquer valor que, ao mudar, reseta para a página 1 (ex: string de filtros)
 */
export function usePagination<T>(data: T[], pageSize = 20, resetKey?: unknown) {
  const [page, setPage] = useState(1);

  // Reseta para página 1 quando resetKey muda (filtro, busca, etc.)
  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const visibleData = useMemo(() => {
    return data.slice(0, page * pageSize);
  }, [data, page, pageSize]);

  const hasMore = visibleData.length < data.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  return { visibleData, hasMore, loadMore, total: data.length };
}
