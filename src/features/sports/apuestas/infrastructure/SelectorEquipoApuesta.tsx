import React from 'react';
import { Partido } from '../../partidos/domain/partidoModels';

interface Props {
  partido?: Partido;
  equipoId: number;
  onChange: (equipoId: number) => void;
}

/** Selector del equipo por el que se apuesta (Local / Visitante). */
export const SelectorEquipoApuesta: React.FC<Props> = ({ partido, equipoId, onChange }) => {
  const equipos = partido?.partidoEquipos ?? [];
  return (
    <div>
      <label className="block font-semibold text-slate-700 mb-1">Apuesto por</label>
      <div className="grid grid-cols-2 gap-2">
        {equipos.map((pe) => {
          const activo = equipoId === pe.id_equipo;
          return (
            <button
              type="button"
              key={pe.id_equipo}
              onClick={() => onChange(pe.id_equipo)}
              className={`p-2 rounded-lg border font-semibold transition-all ${
                activo ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="block text-[9px] uppercase opacity-70">{pe.rol}</span>
              {pe.equipo?.nombre || `Equipo #${pe.id_equipo}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};
