import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Users, Shield, Lock } from 'lucide-react';
import { RoleDTO } from '../domain/roleModels';

interface RolesTableProps {
  roles: RoleDTO[];
  onEdit: (role: RoleDTO) => void;
  onDelete: (role: RoleDTO) => void;
}

export const RolesTable: React.FC<RolesTableProps> = ({ roles, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              <th className="py-3 px-5">ID</th>
              <th className="py-3 px-4">Nombre del Rol</th>
              <th className="py-3 px-4">Descripcion</th>
              <th className="py-3 px-5 text-right">Accesos y Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {roles.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5 font-mono text-slate-400">#{r.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  <span className="inline-flex items-center gap-1.5 font-bold">
                    <Shield className="h-3.5 w-3.5 text-indigo-600" />
                    {r.name}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{r.description}</td>
                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/roles/${r.id}/users`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                      title="Ver usuarios de este rol"
                    >
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>Usuarios</span>
                    </Link>

                    <Link
                      to={`/admin/roles/${r.id}/permissions`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                      title="Configurar matriz de permisos"
                    >
                      <Lock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Matriz</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => onEdit(r)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(r)}
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

