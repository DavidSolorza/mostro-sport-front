import React, { useEffect, useState } from 'react';
import { Plus, Search, Lock } from 'lucide-react';
import { permissionApiService } from '../application/permissionService';
import { CreatePermissionDTO, PermissionResponseDTO, UpdatePermissionDTO } from '../domain/permissionModels';
import { PermissionFormModal } from './PermissionFormModal';
import { PermissionTable } from './PermissionTable';

export const PermissionsListPage: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionResponseDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState<PermissionResponseDTO | null>(null);

  const fetchPermissions = async (): Promise<void> => {
    setLoading(true);
    const data = await permissionApiService.getPermissions();
    setPermissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleCreateOrUpdate = async (dto: CreatePermissionDTO | UpdatePermissionDTO): Promise<void> => {
    if (permissionToEdit) {
      await permissionApiService.updatePermission(permissionToEdit.id, dto as UpdatePermissionDTO);
    } else {
      await permissionApiService.createPermission(dto as CreatePermissionDTO);
    }
    setModalOpen(false);
    setPermissionToEdit(null);
    await fetchPermissions();
  };

  const handleDelete = async (perm: PermissionResponseDTO): Promise<void> => {
    if (window.confirm(`¿Esta seguro de eliminar el permiso ${perm.method} ${perm.url}?`)) {
      await permissionApiService.deletePermission(perm.id);
      await fetchPermissions();
    }
  };

  const filtered = permissions.filter(
    (p) =>
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Catalogo de Permisos</h1>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {filtered.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Definicion de privilegios de acceso del sistema</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por recurso, URL o metodo..."
              className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setPermissionToEdit(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Permiso</span>
          </button>
        </div>
      </div>

      <PermissionTable
        permissions={filtered}
        onEdit={(perm) => {
          setPermissionToEdit(perm);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <PermissionFormModal
          permissionToEdit={permissionToEdit}
          onClose={() => {
            setModalOpen(false);
            setPermissionToEdit(null);
          }}
          onSubmit={handleCreateOrUpdate}
          loading={loading}
        />
      )}
    </div>
  );
};
