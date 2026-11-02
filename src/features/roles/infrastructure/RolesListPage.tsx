import React, { useEffect, useState } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { roleApiService } from '../application/roleService';
import { RoleDTO } from '../domain/roleModels';
import { RoleFormModal } from './RoleFormModal';
import { RolesTable } from './RolesTable';

export const RolesListPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (): Promise<void> => {
    setLoading(true);
    const data = await roleApiService.getRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateOrUpdate = async (dto: { name: string; description: string }): Promise<void> => {
    if (roleToEdit) {
      await roleApiService.updateRole(roleToEdit.id, dto);
    } else {
      await roleApiService.createRole(dto);
    }
    setModalOpen(false);
    setRoleToEdit(null);
    await fetchRoles();
  };

  const handleDelete = async (role: RoleDTO): Promise<void> => {
    const users = await roleApiService.getRoleUsers(role.id);
    if (users.length > 0) {
      alert(`No se puede eliminar el rol "${role.name}" porque tiene ${users.length} usuario(s) asignado(s).`);
      return;
    }
    if (window.confirm(`¿Esta seguro de eliminar el rol "${role.name}"?`)) {
      await roleApiService.deleteRole(role.id);
      await fetchRoles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion de Roles</h1>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {roles.length} roles
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Definicion de perfiles de acceso y politicas del sistema</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRoleToEdit(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Rol</span>
        </button>
      </div>

      <RolesTable
        roles={roles}
        onEdit={(r) => {
          setRoleToEdit(r);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <RoleFormModal
          roleToEdit={roleToEdit}
          onClose={() => {
            setModalOpen(false);
            setRoleToEdit(null);
          }}
          onSubmit={handleCreateOrUpdate}
          loading={loading}
        />
      )}
    </div>
  );
};
