import React from 'react';
import { Plus, Search } from 'lucide-react';

interface ModuleHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  count: number;
  countSingular: string;
  countPlural: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: React.ReactNode;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  icon: Icon,
  title,
  subtitle,
  count,
  countSingular,
  countPlural,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  actionLabel,
  onAction,
  extra,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {count} {count === 1 ? countSingular : countPlural}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {extra}
      {onSearchChange && (
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs focus:border-indigo-600 focus:outline-none"
          />
        </div>
      )}
      {onAction && actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  </div>
);
