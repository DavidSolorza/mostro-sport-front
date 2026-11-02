import React, { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { RoleDTO } from '../domain/roleModels';

interface RoleFormModalProps {
  roleToEdit: RoleDTO | null;
  onClose: () => void;
  onSubmit: (dto: { name: string; description: string }) => Promise<void>;
  loading: boolean;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  roleToEdit,
  onClose,
  onSubmit,
  loading,
}) => {
  const [name, setName] = useState(roleToEdit?.name || '');
  const [description, setDescription] = useState(roleToEdit?.description || '');

  const isEditing = Boolean(roleToEdit);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Editar Rol' : 'Registrar Nuevo Rol'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Rol</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. COORDINADOR, ENTRENADOR..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripcion</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa el alcance de este rol..."
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs focus:border-indigo-600 focus:outline-none resize-none"
            />
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
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

