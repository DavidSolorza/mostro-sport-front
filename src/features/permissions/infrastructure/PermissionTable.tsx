import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { PermissionResponseDTO } from '../domain/permissionModels';

interface PermissionTableProps {
  permissions: PermissionResponseDTO[];
  onEdit: (perm: PermissionResponseDTO) => void;
  onDelete: (perm: PermissionResponseDTO) => void;
}

const getMethodBadgeClass = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'POST': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PUT': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const PermissionTable: React.FC<PermissionTableProps> = ({
  permissions,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-4">Modelo / Recurso</th>
              <th className="py-3 px-4">Metodo</th>
              <th className="py-3 px-4">Endpoint URL</th>
              <th className="py-3 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {permissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-mono text-slate-400">#{perm.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">{perm.model}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getMethodBadgeClass(perm.method)}`}>
                    {perm.method}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-600">{perm.url}</td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(perm)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(perm)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

