import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

interface AvailableUser {
  id: number;
  name: string;
  email: string;
}

interface RoleAddUserModalProps {
  roleName: string;
  availableUsers: AvailableUser[];
  onClose: () => void;
  onAddUser: (userId: number) => Promise<void>;
}

export const RoleAddUserModal: React.FC<RoleAddUserModalProps> = ({
  roleName,
  availableUsers,
  onClose,
  onAddUser,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number>(availableUsers[0]?.id || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedUserId) return;
    setLoading(true);
    await onAddUser(selectedUserId);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Agregar Usuario al Rol</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-500">
            Seleccione el usuario al cual desea conceder el rol <strong>{roleName}</strong>.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Usuario Disponible</label>
            {availableUsers.length > 0 ? (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
              >
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded border border-slate-200">
                Todos los usuarios del sistema ya tienen este rol asignado.
              </p>
            )}
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
              disabled={loading || availableUsers.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{loading ? 'Asignando...' : 'Asignar Rol'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

