import React from 'react';
import { Scale, AlertTriangle, CheckSquare, Square } from 'lucide-react';

export const RoleAccessRulesCard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 mb-2.5">Leyenda</h4>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-emerald-600" />
            <span>Permiso asignado</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-slate-400" />
            <span>Permiso no asignado</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
          <Scale className="h-4 w-4 text-indigo-600" />
          <span>Reglas de acceso</span>
        </div>
        <ul className="space-y-2 text-[11px] text-slate-600 leading-relaxed list-disc list-inside">
          <li>Si al menos uno de los roles del usuario posee el permiso, la operacion se permite.</li>
          <li>Si ninguno de sus roles posee el permiso requerido, el acceso se deniega.</li>
          <li>Los cambios aplican a todos los usuarios que tengan asignado este rol.</li>
        </ul>

        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Retirar un permiso del rol no elimina el permiso del sistema.</span>
        </div>
      </div>
    </div>
  );
};

