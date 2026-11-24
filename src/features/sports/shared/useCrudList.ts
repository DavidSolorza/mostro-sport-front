import { useCallback, useEffect, useRef, useState } from 'react';
import { toUserMessage } from './errorMessage';
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, Page, PageQuery } from './pagination';

export const useDebouncedValue = <T,>(value: T, delayMs = 300): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
};

interface UseCrudListResult<T> {
  rows: T[];
  total: number;
  page: number;
  setPage: (p: number) => void;
  size: number;
  loading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  reload: () => void;
}

/**
 * Carga un listado paginado. `fetcher` debe ser estable o cambiar solo cuando cambian los filtros;
 * al cambiar `filterKey` se vuelve a la primera página.
 */
export const useCrudList = <T,>(
  fetcher: (q: Required<PageQuery>) => Promise<Page<T>>,
  filterKey: string
): UseCrudListResult<T> => {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(FIRST_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    setPage(FIRST_PAGE);
  }, [filterKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcherRef
      .current({ page, size: DEFAULT_PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setRows(res.content);
        setTotal(res.totalElements);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(toUserMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, filterKey, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { rows, total, page, setPage, size: DEFAULT_PAGE_SIZE, loading, error, setError, reload };
};
