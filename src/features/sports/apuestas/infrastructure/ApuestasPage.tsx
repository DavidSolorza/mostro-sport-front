import React, { useState, useEffect } from 'react';
import { Apuesta, CreateApuestaDto } from '../domain/apuestaModels';
import { apuestasService } from '../application/apuestasService';
import { NuevaApuestaModal } from './NuevaApuestaModal';
import { Coins, Plus } from 'lucide-react';

export const ApuestasPage: React.FC = () => {
  const [apuestas, setApuestas] = useState<Apuesta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const aficionadoIdFijo = 1; // Aficionado activo por defecto

  const fetchApuestas = async () => {
    setLoading(true);
    try {
      const data = await apuestasService.getApuestas();
      setApuestas(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApuestas();
  }, []);

  const handleCrearApuesta = async (dto: CreateApuestaDto) => {
    await apuestasService.crearApuesta(dto);
    await fetchApuestas();
  };

  const handleCancelar = async (id: number) => {
    if (!confirm('¿Seguro que deseas cancelar esta apuesta?')) return;
    await apuestasService.cancelarApuesta(id);
    await fetchApuestas();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-600" /> Apuestas Deportivas (HU-GC-11)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro con congelamiento de cuota y liquidación automática al finalizar el encuentro.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nueva Apuesta
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando apuestas...</div>
      ) : apuestas.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          No hay apuestas registradas en el sistema.
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Partido</th>
                <th className="py-3 px-4">Aficionado</th>
                <th className="py-3 px-4 text-right">Monto</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apuestas.map((ap) => {
                const local = ap.partido?.partidoEquipos?.find((p) => p.rol === 'LOCAL')?.equipo?.nombre || 'Local';
                const vis = ap.partido?.partidoEquipos?.find((p) => p.rol === 'VISITANTE')?.equipo?.nombre || 'Vis';
                return (
                  <tr key={ap.id_apuesta} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-500">#{ap.id_apuesta}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{local} vs {vis}</td>
                    <td className="py-3 px-4 text-slate-600">{ap.aficionado?.nombre || `Aficionado #${ap.id_aficionado}`}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-indigo-600">${Number(ap.monto).toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        ap.estado === 'GANADA' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        ap.estado === 'PERDIDA' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        ap.estado === 'CANCELADA' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {ap.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {ap.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => handleCancelar(ap.id_apuesta)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold underline"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <NuevaApuestaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCrearApuesta}
        aficionadoId={aficionadoIdFijo}
      />
    </div>
  );
};
