import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Zap, Target } from 'lucide-react';

interface Props {
  simulando: boolean;
  velocidad: number;
  onToggleSimulacion: () => void;
  onCambiarVelocidad: (v: number) => void;
  onSimularPase: () => void;
  onSimularRemate: (equipo: 'LOCAL' | 'VISITANTE') => void;
  onRestablecer: () => void;
}

export const ControlesSimulacionBar: React.FC<Props> = ({
  simulando,
  velocidad,
  onToggleSimulacion,
  onCambiarVelocidad,
  onSimularPase,
  onSimularRemate,
  onRestablecer,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
      {/* Controles de Reproducción */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSimulacion}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            simulando
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {simulando ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {simulando ? 'Pausar Simulación' : 'Simulación en Vivo'}
        </button>

        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => onCambiarVelocidad(1)}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              velocidad === 1 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => onCambiarVelocidad(2)}
            className={`px-2 py-1 rounded font-semibold flex items-center gap-0.5 transition-all ${
              velocidad === 2 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FastForward className="w-3 h-3" /> 2x
          </button>
        </div>
      </div>

      {/* Acciones de Jugadas Tácticas */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={onSimularPase}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Pase / Jugada
        </button>

        <button
          onClick={() => onSimularRemate('LOCAL')}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
        >
          <Target className="w-3.5 h-3.5 text-indigo-600" /> Remate Local
        </button>

        <button
          onClick={() => onSimularRemate('VISITANTE')}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
        >
          <Target className="w-3.5 h-3.5 text-rose-600" /> Remate Vis.
        </button>

        <button
          onClick={onRestablecer}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
          title="Restablecer posiciones base"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
