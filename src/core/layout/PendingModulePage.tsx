import React from 'react';
import { Layers, Plus, Search, Filter, Clock } from 'lucide-react';

interface PendingModulePageProps {
  title: string;
}

export const PendingModulePage: React.FC<PendingModulePageProps> = ({ title }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modulo de gestion y administracion de datos institucionales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm opacity-60 cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo Registro</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Registros Totales', value: '--', desc: 'Sincronizacion de catalogo' },
          { label: 'Estado del Servicio', value: 'Activo', desc: 'Conectividad API REST' },
          { label: 'Ultima Auditoria', value: 'Pendiente', desc: 'Registro de trazabilidad' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-lg font-bold text-slate-900 mt-1">{card.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              disabled
              placeholder="Buscar registros..."
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:outline-none cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 opacity-60 cursor-not-allowed"
            >
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
            <Layers className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Modulo en proceso de vinculacion</h2>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            La estructura funcional de {title.toLowerCase()} esta preparada para conectar con los endpoints de la API.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-3 py-1">
            <Clock className="h-3 w-3" />
            <span>Disponible en la siguiente iteracion del sprint</span>
          </div>
        </div>
      </div>
    </div>
  );
};
