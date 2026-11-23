import React from 'react';
import { JugadorTactico, PelotaPosicion } from '../domain/pizarraModels';

interface Props {
  jugadores: JugadorTactico[];
  balon: PelotaPosicion;
}

export const CampoDeportivoSvg: React.FC<Props> = ({ jugadores, balon }) => {
  return (
    <div className="relative w-full aspect-[16/10] bg-emerald-700 rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-800">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 625">
        {/* Líneas de Cancha */}
        <rect x="30" y="30" width="940" height="565" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <line x1="500" y1="30" x2="500" y2="595" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <circle cx="500" cy="312.5" r="90" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <circle cx="500" cy="312.5" r="5" fill="rgba(255,255,255,0.8)" />

        {/* Áreas Locales */}
        <rect x="30" y="162.5" width="165" height="300" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <rect x="30" y="237.5" width="55" height="150" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <circle cx="140" cy="312.5" r="4" fill="rgba(255,255,255,0.8)" />

        {/* Áreas Visitantes */}
        <rect x="805" y="162.5" width="165" height="300" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <rect x="915" y="237.5" width="55" height="150" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
        <circle cx="860" cy="312.5" r="4" fill="rgba(255,255,255,0.8)" />
      </svg>

      {/* Jugadores en Posición */}
      {jugadores.map((j) => (
        <div
          key={j.id}
          style={{ left: `${j.x}%`, top: `${j.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-300"
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-md border-2 border-white ${
              j.equipo === 'LOCAL' ? 'bg-indigo-600' : 'bg-rose-600'
            }`}
          >
            {j.posicion || j.id}
          </div>
          <span className="text-[9px] font-semibold text-white bg-slate-900/80 px-1.5 py-0.5 rounded shadow mt-0.5 truncate max-w-[80px]">
            {j.nombre}
          </span>
        </div>
      ))}

      {/* Balón */}
      <div
        style={{ left: `${balon.x}%`, top: `${balon.y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-900 shadow-lg flex items-center justify-center animate-bounce"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
      </div>
    </div>
  );
};
