import React from 'react';
import { FIRST_PAGE } from '../pagination';

interface PaginationProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, size, total, onPageChange }) => {
  if (total <= size) return null;
  const from = (page - FIRST_PAGE) * size + 1;
  const to = Math.min(total, (page - FIRST_PAGE + 1) * size);
  const lastPage = FIRST_PAGE + Math.ceil(total / size) - 1;

  return (
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span>
        {from}-{to} de {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= FIRST_PAGE}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
