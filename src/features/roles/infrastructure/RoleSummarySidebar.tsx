import React from 'react';
import { UserCheck, Users, Key, Box, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { RoleSummaryMetrics } from '../domain/roleModels';
import { RoleAccessRulesCard } from './RoleAccessRulesCard';

interface RoleSummarySidebarProps {
  metrics: RoleSummaryMetrics;
}

export const RoleSummarySidebar: React.FC<RoleSummarySidebarProps> = ({ metrics }) => {
  const unassignedCount = metrics.totalAvailablePermissions - metrics.assignedPermissionsCount;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <UserCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Resumen del rol</h3>
        </div>

        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
          <span className="text-slate-500">Nombre del rol:</span>
          <span className="font-bold text-slate-900">{metrics.roleName}</span>
        </div>

        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
          <span className="text-slate-500">Estado:</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>{metrics.status}</span>
          </span>
        </div>

        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>Usuarios asociados:</span>
            </div>
            <span className="font-bold text-slate-900">{metrics.associatedUsersCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-slate-400" />
              <span>Total permisos asignados:</span>
            </div>
            <span className="font-bold text-slate-900">{metrics.assignedPermissionsCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-slate-400" />
              <span>Modulos con acceso:</span>
            </div>
            <span className="font-bold text-slate-900">{metrics.modulesWithAccessCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <Shield className="h-4 w-4 text-slate-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">Disponibles</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{metrics.totalAvailablePermissions}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
            <p className="text-[10px] text-emerald-700 font-medium">Asignados</p>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">{metrics.assignedPermissionsCount}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <XCircle className="h-4 w-4 text-slate-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-500 font-medium">No asignados</p>
            <p className="text-sm font-bold text-slate-700 mt-0.5">{unassignedCount}</p>
          </div>
        </div>
      </div>

      <RoleAccessRulesCard />
    </div>
  );
};

