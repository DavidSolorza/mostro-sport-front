export interface Page<T> {
  content: T[];
  totalElements: number;
}

export interface PageQuery {
  page?: number;
  size?: number;
}

/** Primera página según ms_negocio: la paginación es base 0 (skip = page * size). */
export const FIRST_PAGE = 0;
export const DEFAULT_PAGE_SIZE = 10;
export const SELECT_PAGE_SIZE = 100;

type QueryValue = string | number | boolean | undefined | null;

export const buildQuery = (params: Record<string, QueryValue>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const asArray = <T>(res: T[] | Page<T> | null | undefined): T[] => {
  if (!res) return [];
  return Array.isArray(res) ? res : res.content ?? [];
};

/** Recorta un ISO con hora a YYYY-MM-DD sin pasar por Date (evita desfase de zona horaria). */
export const toDateInput = (value?: string | null): string => (value ? value.slice(0, 10) : '');
