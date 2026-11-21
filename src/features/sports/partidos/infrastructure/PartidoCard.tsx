import React from 'react';
import { Partido } from '../domain/partidoModels';
import { Calendar, MapPin, Play, CheckCircle2, PlusCircle } from 'lucide-react';

interface Props {
  partido: Partido;
  onCambiarEstado: (id: number, estado: 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO') => void;
  onOpenAnotacion: (partido: Partido) => void;
  onOpenFinalizar: (partido: Partido) => void;
}

export const PartidoCard: React.FC<Props> = ({
  partido,
  onCambiarEstado,
  onOpenAnotacion,
  onOpenFinalizar,
}) => {
  const local = partido.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
  const visitante = partido.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Visitante';
  const totalAnotaciones = partido.anotaciones?.length || 0;

  const estadoBadge = {
    PROGRAMADO: 'bg-amber-100 text-amber-800 border-amber-200',
    EN_CURSO: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse',
    FINALIZADO: 'bg-slate-100 text-slate-700 border-slate-300',
    CANCELADO: 'bg-rose-100 text-rose-700 border-rose-200',
  }[partido.estado];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${estadoBadge}`}>
          {partido.estado}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {partido.torneo?.nombre || `Torneo #${partido.id_torneo}`}
        </span>
      </div>

      <div className="flex items-center justify-between my-4 px-2">
        <div className="text-center flex-1">
          <p className="font-bold text-slate-800 text-base">{local}</p>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Local</span>
        </div>
        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-center">
          <span className="text-xl font-extrabold text-indigo-600">{totalAnotaciones}</span>
          <p className="text-[9px] text-slate-400 font-semibold uppercase">Goles/Pts</p>
        </div>
        <div className="text-center flex-1">
          <p className="font-bold text-slate-800 text-base">{visitante}</p>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Visitante</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date(partido.fecha_hora).toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{partido.escenario?.nombre || `Escenario #${partido.id_escenario}`}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
        {partido.estado === 'PROGRAMADO' && (
          <button
            onClick={() => onCambiarEstado(partido.id_partido, 'EN_CURSO')}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar
          </button>
        )}
        {partido.estado === 'EN_CURSO' && (
          <>
            <button
              onClick={() => onOpenAnotacion(partido)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Gol / Pts
            </button>
            <button
              onClick={() => onOpenFinalizar(partido)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Finalizar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
