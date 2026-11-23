import React from 'react';
import { JugadorTactico, PelotaPosicion } from '../domain/pizarraModels';
import { Sparkles } from 'lucide-react';

interface Props {
  jugadores: JugadorTactico[];
  balon: PelotaPosicion;
  mostrarGol: boolean;
}

export const JugadoresCapaTactico: React.FC<Props> = ({ jugadores, balon, mostrarGol }) => {
  return (
    <>
      {/* Banner festivo animado de ¡GOL! */}
      {mostrarGol && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 text-white font-black text-3xl sm:text-5xl px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 border-4 border-white animate-bounce">
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300" />
            ¡GOOOOOOOL!
            <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300" />
          </div>
        </div>
      )}

      {/* Capa de Jugadores */}
      {jugadores.map((j) => {
        const esLocal = j.equipo === 'LOCAL';
        return (
          <div
            key={j.id}
            style={{ left: `${j.x}%`, top: `${j.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-500 ease-out z-10"
          >
            {/* Ficha / Camiseta con dorsal */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] sm:text-xs text-white shadow-xl border-2 transition-transform group-hover:scale-125 ${
                esLocal
                  ? 'bg-gradient-to-tr from-indigo-700 to-indigo-500 border-indigo-200 shadow-indigo-900/50'
                  : 'bg-gradient-to-tr from-rose-700 to-rose-500 border-rose-200 shadow-rose-900/50'
              }`}
            >
              {j.dorsal || j.id}
            </div>

            {/* Etiqueta con Nombre y Posición */}
            <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-xs px-1.5 py-0.5 rounded-md shadow-md mt-0.5 border border-white/10 group-hover:bg-slate-900">
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-100 truncate max-w-[65px] sm:max-w-[75px]">
                {j.nombre}
              </span>
              {j.posicion && (
                <span
                  className={`text-[7px] font-extrabold px-1 rounded ${
                    esLocal ? 'bg-indigo-900/80 text-indigo-300' : 'bg-rose-900/80 text-rose-300'
                  }`}
                >
                  {j.posicion}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Balón de fútbol con sombra 3D */}
      <div
        style={{ left: `${balon.x}%`, top: `${balon.y}%` }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300 ease-out"
      >
        <div className="relative flex items-center justify-center">
          {/* Sombra suave proyectada */}
          <div className="absolute top-2 w-4 h-2 bg-black/40 rounded-full blur-[1px]" />
          {/* Esfera del balón */}
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border border-slate-900 shadow-md flex items-center justify-center animate-spin [animation-duration:3s]">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-xs" />
          </div>
        </div>
      </div>
    </>
  );
};
