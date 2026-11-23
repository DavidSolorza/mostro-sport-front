import React from 'react';
import { EventoEnVivo } from '../domain/pizarraModels';
import { Activity, Flame, ShieldAlert, Sparkles, Zap } from 'lucide-react';

interface Props {
  eventos: EventoEnVivo[];
}

export const FeedEventosEnVivo: React.FC<Props> = ({ eventos }) => {
  const getIcono = (tipo: EventoEnVivo['tipo']) => {
    switch (tipo) {
      case 'GOL':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'TIRO':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'FALTA':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
          <Activity className="w-4 h-4 text-indigo-600" /> Sucesos del Encuentro
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          En Vivo
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1 divide-y divide-slate-50">
        {eventos.map((ev) => {
          const esLocal = ev.equipo === 'LOCAL';
          return (
            <div key={ev.id} className="pt-2 flex items-start gap-2 text-xs">
              <span className="font-mono text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {ev.minuto}'
              </span>
              <div className="mt-0.5">{getIcono(ev.tipo)}</div>
              <div className="flex-1 leading-snug">
                <p className="text-slate-800 font-medium text-[11px]">
                  {ev.descripcion}
                </p>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    esLocal ? 'text-indigo-600' : 'text-rose-600'
                  }`}
                >
                  {ev.equipo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
