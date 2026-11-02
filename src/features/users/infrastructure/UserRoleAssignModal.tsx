import React, { useState } from 'react';
import { X, Shield, Check, Plus, Trash2 } from 'lucide-react';
import { UserRoleResponseDTO, UserWithRolesDTO } from '../domain/userModels';

interface UserRoleAssignModalProps {
  user: UserWithRolesDTO;
  availableRoles: UserRoleResponseDTO[];
  onClose: () => void;
  onAssignRole: (userId: number, roleId: number) => Promise<void>;
  onRemoveRole: (userId: number, roleId: number) => Promise<void>;
}

export const UserRoleAssignModal: React.FC<UserRoleAssignModalProps> = ({
  user,
  availableRoles,
  onClose,
  onAssignRole,
  onRemoveRole,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number>(availableRoles[0]?.id || 1);
  const [loading, setLoading] = useState<boolean>(false);

  const assignedRoleIds = new Set((user.roles || []).map((r) => r.id));

  const handleAssign = async (): Promise<void> => {
    if (!selectedRoleId || assignedRoleIds.has(selectedRoleId)) return;
    setLoading(true);
    await onAssignRole(user.id, selectedRoleId);
    setLoading(false);
  };

  const handleRemove = async (roleId: number): Promise<void> => {
    setLoading(true);
    await onRemoveRole(user.id, roleId);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Roles de Acceso</h2>
            <p className="text-xs text-slate-500 mt-0.5">{user.name} ({user.email})</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Roles actualmente asignados</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((r) => (
                  <div
                    key={r.id || r.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-800">{r.name}</span>
                    </div>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleRemove(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remover rol"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic p-2">El usuario no tiene roles asignados.</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Asignar nuevo rol</label>
            <div className="flex gap-2">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:outline-none"
              >
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id} disabled={assignedRoleIds.has(role.id)}>
                    {role.name} {assignedRoleIds.has(role.id) ? '(Asignado)' : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={loading || assignedRoleIds.has(selectedRoleId)}
                onClick={handleAssign}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Asignar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Finalizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

