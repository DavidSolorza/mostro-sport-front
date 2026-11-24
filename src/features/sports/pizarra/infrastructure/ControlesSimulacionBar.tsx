import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Zap, Target, Radio } from 'lucide-react';
import { ModoPizarra } from '../domain/pizarraModels';

interface Props {
  modo: ModoPizarra;
  simulando: boolean;
  velocidad: number;
  onCambiarModo: (m: ModoPizarra) => void;
  onToggleSimulacion: () => void;
  onCambiarVelocidad: (v: number) => void;
  onSimularPase: () => void;
  onSimularRemate: (equipo: 'LOCAL' | 'VISITANTE') => void;
  onRestablecer: () => void;
}

export const ControlesSimulacionBar: React.FC<Props> = ({
  modo,
  simulando,
  velocidad,
  onCambiarModo,
  onToggleSimulacion,
  onCambiarVelocidad,
  onSimularPase,
  onSimularRemate,
  onRestablecer,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => onCambiarModo('EN_VIVO_API')}
            className={`px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all ${
              modo === 'EN_VIVO_API' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            <Radio className="w-3 h-3" /> En Vivo (API)
          </button>
          <button
            onClick={() => onCambiarModo('SIMULADOR')}
            className={`px-2.5 py-1 rounded font-bold transition-all ${
              modo === 'SIMULADOR' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Simulador
          </button>
        </div>

        <button
          onClick={onToggleSimulacion}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            simulando ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {simulando ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {simulando ? 'Pausar' : 'Reanudar'}
        </button>

        {modo === 'SIMULADOR' && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => onCambiarVelocidad(1)}
              className={`px-2 py-1 rounded font-semibold ${velocidad === 1 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
            >
              1x
            </button>
            <button
              onClick={() => onCambiarVelocidad(2)}
              className={`px-2 py-1 rounded font-semibold flex items-center gap-0.5 ${velocidad === 2 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
            >
              <FastForward className="w-3 h-3" /> 2x
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button onClick={onSimularPase} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Pase
        </button>
        <button onClick={() => onSimularRemate('LOCAL')} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-indigo-600" /> Remate Local
        </button>
        <button onClick={() => onSimularRemate('VISITANTE')} className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-rose-600" /> Remate Vis.
        </button>
        <button onClick={onRestablecer} className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold border border-slate-200" title="Recargar datos reales del partido">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
