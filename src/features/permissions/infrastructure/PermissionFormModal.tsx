import React, { useState } from 'react';
import { X, Lock, Globe, Layers } from 'lucide-react';
import { CreatePermissionDTO, HTTP_METHODS, PermissionResponseDTO, UpdatePermissionDTO } from '../domain/permissionModels';

interface PermissionFormModalProps {
  permissionToEdit: PermissionResponseDTO | null;
  onClose: () => void;
  onSubmit: (dto: CreatePermissionDTO | UpdatePermissionDTO) => Promise<void>;
  loading: boolean;
}

export const PermissionFormModal: React.FC<PermissionFormModalProps> = ({
  permissionToEdit,
  onClose,
  onSubmit,
  loading,
}) => {
  const [model, setModel] = useState(permissionToEdit?.model || 'Users');
  const [method, setMethod] = useState(permissionToEdit?.method || 'GET');
  const [url, setUrl] = useState(permissionToEdit?.url || '/api/users');

  const isEditing = Boolean(permissionToEdit);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit({ model: model.trim(), method, url: url.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Editar Permiso' : 'Registrar Nuevo Permiso'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo / Recurso</label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Users, Roles, Permissions..."
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Metodo HTTP</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none font-mono"
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ruta URL del Endpoint</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/api/recurso..."
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs font-mono focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Permiso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

