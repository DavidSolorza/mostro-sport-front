import React from 'react';
import { EstadisticasPartido } from '../domain/pizarraModels';
import { BarChart3 } from 'lucide-react';

interface Props {
  stats: EstadisticasPartido;
  localNombre: string;
  visitanteNombre: string;
}

export const EstadisticasPartidoPanel: React.FC<Props> = ({ stats, localNombre, visitanteNombre }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <BarChart3 className="w-4 h-4 text-emerald-600" /> Estadísticas del Partido
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-semibold">
          <span className="text-indigo-600 truncate max-w-[80px]">{localNombre}</span>
          <span className="text-slate-300">vs</span>
          <span className="text-rose-600 truncate max-w-[80px]">{visitanteNombre}</span>
        </div>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Posesión de Balón */}
        <div>
          <div className="flex justify-between text-[11px] font-bold mb-1">
            <span className="text-indigo-600">{stats.posesionLocal}%</span>
            <span className="text-slate-500 font-medium">Posesión</span>
            <span className="text-rose-600">{stats.posesionVisitante}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${stats.posesionLocal}%` }} className="bg-indigo-600 transition-all duration-500" />
            <div style={{ width: `${stats.posesionVisitante}%` }} className="bg-rose-500 transition-all duration-500" />
          </div>
        </div>

        {/* Tiros Totales */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="font-bold text-slate-800">{stats.tirosLocal}</span>
          <span className="text-slate-500 text-[11px]">Tiros Totales</span>
          <span className="font-bold text-slate-800">{stats.tirosVisitante}</span>
        </div>

        {/* Tiros a Puerta */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="font-bold text-indigo-600">{stats.tirosPuertaLocal}</span>
          <span className="text-slate-500 text-[11px]">Tiros al Arco</span>
          <span className="font-bold text-rose-600">{stats.tirosPuertaVisitante}</span>
        </div>

        {/* Faltas */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="font-bold text-slate-700">{stats.faltasLocal}</span>
          <span className="text-slate-500 text-[11px]">Faltas</span>
          <span className="font-bold text-slate-700">{stats.faltasVisitante}</span>
        </div>

        {/* Tiros de Esquina */}
        <div className="flex items-center justify-between py-1">
          <span className="font-bold text-slate-700">{stats.cornersLocal}</span>
          <span className="text-slate-500 text-[11px]">Tiros de Esquina</span>
          <span className="font-bold text-slate-700">{stats.cornersVisitante}</span>
        </div>
      </div>
    </div>
  );
};
