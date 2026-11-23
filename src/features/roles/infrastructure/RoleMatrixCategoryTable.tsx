import React from 'react';
import { PermissionMatrixMap } from '../domain/roleModels';

interface RoleMatrixCategoryTableProps {
  matrix: PermissionMatrixMap;
  onToggleCell: (modelKey: string, method: string, permissionId: number) => void;
  disabled?: boolean;
}

export const RoleMatrixCategoryTable: React.FC<RoleMatrixCategoryTableProps> = ({
  matrix,
  onToggleCell,
  disabled,
}) => {
  const models = Object.keys(matrix).sort((a, b) => {
    const labelA = matrix[a]?.GET?.[0]?.model || a;
    const labelB = matrix[b]?.GET?.[0]?.model || b;
    return labelA.localeCompare(labelB);
  });

  const methodSet = new Set<string>();
  Object.values(matrix).forEach((methods) => {
    Object.keys(methods).forEach((method) => methodSet.add(method));
  });
  const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const methods = Array.from(methodSet).sort((a, b) => {
    const indexA = methodOrder.indexOf(a);
    const indexB = methodOrder.indexOf(b);
    if (indexA >= 0 || indexB >= 0) return (indexA < 0 ? 999 : indexA) - (indexB < 0 ? 999 : indexB);
    return a.localeCompare(b);
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <h2 className="text-sm font-bold text-slate-800">Matriz de permisos del rol</h2>
        <p className="text-[11px] text-slate-500 mt-1">Permisos existentes agrupados por modelo y método HTTP.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <th className="py-2.5 px-4 w-1/4">Modelo / recurso</th>
              {methods.map((method) => (
                <th key={method} className="py-2.5 px-3 text-center">{method}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {models.length === 0 ? (
              <tr>
                <td colSpan={methods.length + 1} className="py-8 px-4 text-center text-slate-500">
                  No hay permisos registrados en el catálogo.
                </td>
              </tr>
            ) : models.map((modelKey) => {
              const entries = Object.values(matrix[modelKey]).flatMap((items) => items || []);
              const displayName = entries[0]?.model || modelKey;

              return (
                <tr key={modelKey} className="hover:bg-slate-50/60 align-top">
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {displayName}
                  </td>
                  {methods.map((method) => {
                    const permissionEntries = matrix[modelKey]?.[method] || [];
                    return (
                      <td key={method} className="py-3 px-3">
                        {permissionEntries.length === 0 ? (
                          <span className="block text-center text-slate-300">—</span>
                        ) : (
                          <div className="flex flex-col gap-2 min-w-[140px]">
                            {permissionEntries.map((entry) => (
                              <label
                                key={entry.id}
                                className="flex items-start gap-2 rounded-md border border-slate-200 px-2 py-1.5 hover:bg-white cursor-pointer"
                                title={entry.url}
                              >
                                <input
                                  type="checkbox"
                                  checked={entry.assigned}
                                  disabled={disabled}
                                  onChange={() => onToggleCell(modelKey, method, entry.id)}
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                />
                                <span className="break-all text-[10px] leading-4 text-slate-700">{entry.url}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

