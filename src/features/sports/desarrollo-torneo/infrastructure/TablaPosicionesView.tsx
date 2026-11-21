import React from 'react';
import { PosicionEquipo } from '../domain/desarrolloModels';

interface Props {
  posiciones: PosicionEquipo[];
}

export const TablaPosicionesView: React.FC<Props> = ({ posiciones }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tabla General de Clasificación</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
            <tr>
              <th className="py-2.5 px-4 text-center w-12">#</th>
              <th className="py-2.5 px-4">Equipo</th>
              <th className="py-2.5 px-3 text-center">PJ</th>
              <th className="py-2.5 px-3 text-center">PG</th>
              <th className="py-2.5 px-3 text-center">PE</th>
              <th className="py-2.5 px-3 text-center">PP</th>
              <th className="py-2.5 px-3 text-center">GF</th>
              <th className="py-2.5 px-3 text-center">GC</th>
              <th className="py-2.5 px-3 text-center">DG</th>
              <th className="py-2.5 px-4 text-center font-bold text-indigo-600">PTS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posiciones.map((pos, idx) => (
              <tr key={pos.equipoId} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-4 text-center font-bold text-slate-500">{idx + 1}</td>
                <td className="py-2.5 px-4 font-semibold text-slate-800">{pos.nombre}</td>
                <td className="py-2.5 px-3 text-center">{pos.pj}</td>
                <td className="py-2.5 px-3 text-center text-emerald-600">{pos.pg}</td>
                <td className="py-2.5 px-3 text-center text-amber-600">{pos.pe}</td>
                <td className="py-2.5 px-3 text-center text-rose-600">{pos.pp}</td>
                <td className="py-2.5 px-3 text-center">{pos.gf}</td>
                <td className="py-2.5 px-3 text-center">{pos.gc}</td>
                <td className="py-2.5 px-3 text-center font-semibold">{pos.dg > 0 ? `+${pos.dg}` : pos.dg}</td>
                <td className="py-2.5 px-4 text-center font-extrabold text-indigo-600 bg-indigo-50/50">{pos.puntos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
