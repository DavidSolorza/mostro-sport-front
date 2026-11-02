import React, { useState } from 'react';
import { ChevronDown, Check, Save, RotateCcw, CheckCircle2, Info, X } from 'lucide-react';
import { RoleDTO } from '../domain/roleModels';

interface RoleMatrixTopBarProps {
  roles: RoleDTO[];
  selectedRoleId: number;
  onSelectRole: (roleId: number) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  hasChanges: boolean;
  feedback: { type: 'success' | 'error'; message: string } | null;
  onClearFeedback: () => void;
}

export const RoleMatrixTopBar: React.FC<RoleMatrixTopBarProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
  onSave,
  onReset,
  saving,
  hasChanges,
  feedback,
  onClearFeedback,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Asignar Permisos a Roles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra de manera centralizada los permisos que puede ejecutar cada rol del sistema.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Rol seleccionado</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-3 min-w-[200px] rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:border-slate-400 focus:outline-none"
            >
              <span>{currentRole?.name || 'Seleccionar Rol'}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-30 space-y-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      onSelectRole(role.id);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full rounded-lg px-3 py-2 text-xs font-medium transition ${
                      role.id === selectedRoleId
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{role.name}</span>
                    {role.id === selectedRoleId && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 self-end">
            <button
              type="button"
              disabled={!hasChanges || saving}
              onClick={onSave}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
            </button>

            <button
              type="button"
              disabled={!hasChanges || saving}
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {feedback && (
          <div className="flex-1 flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-medium text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <button type="button" onClick={onClearFeedback} className="hover:opacity-75">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-600">
          <Info className="h-4 w-4 text-indigo-500 shrink-0" />
          <span>Los permisos seleccionados se conservaran tras cerrar e iniciar sesion nuevamente.</span>
        </div>
      </div>
    </div>
  );
};

