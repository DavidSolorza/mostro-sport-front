import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, KeyRound, Lock, Trophy, Shield, User, Calendar, Ticket, MapPin, BarChart3 } from 'lucide-react';
import { CrudAction, CRUD_ACTIONS, PermissionMatrixMap, RESOURCE_CATEGORIES, ResourceItem } from '../domain/roleModels';

interface RoleMatrixCategoryTableProps {
  matrix: PermissionMatrixMap;
  onToggleCell: (resourceKey: string, action: CrudAction) => void;
  disabled?: boolean;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users': return Users;
    case 'KeyRound': return KeyRound;
    case 'Lock': return Lock;
    case 'Trophy': return Trophy;
    case 'Shield': return Shield;
    case 'User': return User;
    case 'Calendar': return Calendar;
    case 'Ticket': return Ticket;
    case 'MapPin': return MapPin;
    default: return BarChart3;
  }
};

export const RoleMatrixCategoryTable: React.FC<RoleMatrixCategoryTableProps> = ({
  matrix,
  onToggleCell,
  disabled,
}) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <h2 className="text-sm font-bold text-slate-800">Matriz de permisos del rol</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
              <th className="py-2.5 px-4 w-1/3">Recurso</th>
              {CRUD_ACTIONS.map((a) => (
                <th key={a.key} className="py-2.5 px-3 text-center">{a.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {RESOURCE_CATEGORIES.map((cat) => {
              const isCollapsed = Boolean(collapsed[cat.id]);
              return (
                <React.Fragment key={cat.id}>
                  <tr
                    onClick={() => toggleCategory(cat.id)}
                    className="bg-slate-100/60 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    <td colSpan={6} className="py-2 px-4">
                      <div className="flex items-center gap-1.5">
                        {isCollapsed ? <ChevronRight className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        <span className="text-xs uppercase tracking-wider text-slate-600">{cat.name}</span>
                      </div>
                    </td>
                  </tr>

                  {!isCollapsed &&
                    cat.resources.map((item: ResourceItem) => {
                      const Icon = getIcon(item.iconName);
                      const rowVals = matrix[item.key] || ({} as Record<CrudAction, boolean>);
                      return (
                        <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 pl-7">
                            <div className="flex items-center gap-2.5">
                              <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                              <span className="font-medium text-slate-800">{item.label}</span>
                            </div>
                          </td>

                          {CRUD_ACTIONS.map((a) => (
                            <td key={a.key} className="py-3 px-3 text-center">
                              <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded hover:bg-slate-100">
                                <input
                                  type="checkbox"
                                  checked={Boolean(rowVals[a.key])}
                                  disabled={disabled}
                                  onChange={() => onToggleCell(item.key, a.key)}
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

