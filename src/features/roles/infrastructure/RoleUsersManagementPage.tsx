import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserPlus, Trash2, ArrowLeft, Shield, Mail } from 'lucide-react';
import { roleApiService } from '../application/roleService';
import { userApiService } from '../../users/application/userService';
import { RoleDTO } from '../domain/roleModels';
import { RoleAddUserModal } from './RoleAddUserModal';

export const RoleUsersManagementPage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const currentRoleId = Number(roleId) || 1;

  const [role, setRole] = useState<RoleDTO | null>(null);
  const [roleUsers, setRoleUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async (): Promise<void> => {
    const roles = await roleApiService.getRoles();
    setRole(roles.find((r) => r.id === currentRoleId) || null);
    setRoleUsers(await roleApiService.getRoleUsers(currentRoleId));
    setAllUsers(await userApiService.getUsers());
  };

  useEffect(() => {
    loadData();
  }, [currentRoleId]);

  const handleAddUser = async (userId: number): Promise<void> => {
    await userApiService.assignRole({ userId, roleId: currentRoleId });
    setModalOpen(false);
    await loadData();
  };

  const handleRemoveUser = async (user: { id: number; name: string }): Promise<void> => {
    if (window.confirm(`¿Esta seguro de retirar el rol a este usuario (${user.name})?`)) {
      await userApiService.removeRole(user.id, currentRoleId);
      await loadData();
    }
  };

  const assignedIds = new Set(roleUsers.map((u) => u.id));
  const availableUsers = allUsers.filter((u) => !assignedIds.has(u.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/admin/roles')} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" title="Volver">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Usuarios con el Rol: {role?.name || 'Cargando...'}</h1>
              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">{roleUsers.length} miembros</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{role?.description || 'Gestion de usuarios asignados'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/admin/roles/${currentRoleId}/permissions`} className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <Shield className="h-3.5 w-3.5 text-indigo-600" />
            <span>Ver Matriz de Permisos</span>
          </Link>
          <button type="button" onClick={() => setModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700">
            <UserPlus className="h-4 w-4" />
            <span>Asignar Usuario</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {roleUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Mail className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No hay usuarios asignados a este rol</p>
            <p className="text-xs text-slate-400 mt-1">Utilice el boton superior para asignar el primer usuario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                  <th className="py-3 px-5">Usuario</th>
                  <th className="py-3 px-4">Correo Electronico</th>
                  <th className="py-3 px-5 text-right">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {roleUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">{u.name.charAt(0).toUpperCase()}</div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button type="button" onClick={() => handleRemoveUser(u)} title="Retirar rol" className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <RoleAddUserModal
          roleName={role?.name || ''}
          availableUsers={availableUsers}
          onClose={() => setModalOpen(false)}
          onAddUser={handleAddUser}
        />
      )}
    </div>
  );
};
