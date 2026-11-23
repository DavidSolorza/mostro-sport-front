import React from 'react';

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  actions?: (row: T) => React.ReactNode;
  loading?: boolean;
  emptyIcon: React.ElementType;
  emptyTitle: string;
  emptyHint?: string;
}

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  actions,
  loading = false,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyHint = 'Intente ajustar los filtros de busqueda.',
}: DataTableProps<T>): React.ReactElement => {
  if (loading && rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm text-xs text-slate-400">
        Cargando...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <EmptyIcon className="mx-auto h-8 w-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">{emptyTitle}</h3>
        <p className="text-xs text-slate-500 mt-1">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              {columns.map((c, i) => (
                <th key={c.header} className={`py-3 ${i === 0 ? 'px-5' : 'px-4'} ${c.className ?? ''}`}>
                  {c.header}
                </th>
              ))}
              {actions && <th className="py-3 px-5 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-slate-50/70 transition-colors">
                {columns.map((c, i) => (
                  <td key={c.header} className={`py-3.5 ${i === 0 ? 'px-5' : 'px-4'} ${c.className ?? ''}`}>
                    {c.cell(row)}
                  </td>
                ))}
                {actions && (
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
