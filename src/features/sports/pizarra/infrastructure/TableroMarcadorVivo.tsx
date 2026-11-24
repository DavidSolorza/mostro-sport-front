import React from 'react';
import { Radio, Clock, MapPin, Trophy } from 'lucide-react';

interface Props {
  localNombre: string;
  visitanteNombre: string;
  marcadorLocal: number;
  marcadorVisitante: number;
  golesOficiales?: number;
  modo?: 'EN_VIVO_API' | 'SIMULADOR';
  ultimaSincronizacion?: string;
  minuto: number;
  segundo: number;
  periodo: string;
  estado: string;
  torneoNombre?: string;
  escenarioNombre?: string;
}

export const TableroMarcadorVivo: React.FC<Props> = ({
  localNombre,
  visitanteNombre,
  marcadorLocal,
  marcadorVisitante,
  golesOficiales = 0,
  modo = 'EN_VIVO_API',
  ultimaSincronizacion,
  minuto,
  segundo,
  periodo,
  estado,
  torneoNombre,
  escenarioNombre,
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" /> {estado}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium flex items-center gap-1 truncate max-w-[200px]">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> {torneoNombre || 'Torneo Oficial'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate max-w-[180px]">{escenarioNombre || 'Estadio Central'}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 items-center gap-2 sm:gap-6">
        {/* Equipo Local */}
        <div className="flex items-center justify-end gap-3 text-right">
          <div>
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight truncate max-w-[130px] sm:max-w-[200px]">
              {localNombre}
            </h2>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Local
            </span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-base sm:text-lg shadow-lg border border-indigo-400/40">
            {localNombre.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Marcador Central */}
        <div className="flex flex-col items-center justify-center bg-slate-900/90 py-2 sm:py-3 px-3 sm:px-6 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center gap-2 sm:gap-4 font-mono">
            <span className="text-3xl sm:text-5xl font-black text-indigo-400 tracking-tighter">
              {marcadorLocal}
            </span>
            <span className="text-xl sm:text-3xl text-slate-600 font-light">-</span>
            <span className="text-3xl sm:text-5xl font-black text-rose-400 tracking-tighter">
              {marcadorVisitante}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-emerald-400">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">{pad(minuto)}:{pad(segundo)}</span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-slate-300 rounded uppercase">
              {periodo}
            </span>
          </div>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-amber-400">
            {modo === 'EN_VIVO_API' ? 'En Vivo (API)' : 'Simulador'} · Goles oficiales: {golesOficiales}
            {ultimaSincronizacion ? ` · ${ultimaSincronizacion}` : ''}
          </span>
        </div>

        {/* Equipo Visitante */}
        <div className="flex items-center justify-start gap-3 text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-black text-base sm:text-lg shadow-lg border border-rose-400/40">
            {visitanteNombre.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-white tracking-tight truncate max-w-[130px] sm:max-w-[200px]">
              {visitanteNombre}
            </h2>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-rose-400">
              Visitante
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
