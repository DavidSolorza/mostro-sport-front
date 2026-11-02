import React from 'react';
import { Edit2, Shield, Trash2, Mail } from 'lucide-react';
import { UserWithRolesDTO } from '../domain/userModels';

interface UserTableProps {
  users: UserWithRolesDTO[];
  onEdit: (user: UserWithRolesDTO) => void;
  onManageRoles: (user: UserWithRolesDTO) => void;
  onDelete: (user: UserWithRolesDTO) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onManageRoles,
  onDelete,
}) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <Mail className="mx-auto h-8 w-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-semibold text-slate-800">No se encontraron usuarios</h3>
        <p className="text-xs text-slate-500 mt-1">Intente ajustar los filtros de busqueda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
              <th className="py-3 px-5">Usuario</th>
              <th className="py-3 px-4">Correo Electronico</th>
              <th className="py-3 px-4">Roles de Acceso</th>
              <th className="py-3 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400">ID: {user.id}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-600">
                  {user.email}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((r) => (
                        <span
                          key={r.id || r.name}
                          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
                        >
                          <Shield className="h-3 w-3" />
                          <span>{r.name}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Sin rol asignado</span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onManageRoles(user)}
                      title="Gestionar Roles"
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      title="Editar Usuario"
                      className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      title="Eliminar Usuario"
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

