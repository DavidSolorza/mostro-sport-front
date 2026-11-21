import React, { useState, useEffect } from 'react';
import { habilidadesService } from '../application/habilidadesService';
import { HabilidadJugador, AsignarHabilidadDto } from '../domain/habilidadModels';
import { stubsService } from '../../stubs/application/stubsService';
import { JugadorOption } from '../../stubs/domain/stubModels';
import { AsignarHabilidadModal } from './AsignarHabilidadModal';
import { Award, Plus, Trash2 } from 'lucide-react';

export const HabilidadesJugadorPage: React.FC = () => {
  const [jugadores, setJugadores] = useState<JugadorOption[]>([]);
  const [selectedJugadorId, setSelectedJugadorId] = useState<number>(0);
  const [habilidades, setHabilidades] = useState<HabilidadJugador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    stubsService.getJugadores().then((res) => {
      setJugadores(res);
      if (res.length > 0) setSelectedJugadorId(res[0].id_jugador);
    });
  }, []);

  const fetchHabilidades = async (jugadorId: number) => {
    if (!jugadorId) return;
    setLoading(true);
    try {
      const data = await habilidadesService.getHabilidadesPorJugador(jugadorId);
      setHabilidades(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJugadorId) fetchHabilidades(selectedJugadorId);
  }, [selectedJugadorId]);

  const handleAsignar = async (dto: AsignarHabilidadDto) => {
    await habilidadesService.asignarHabilidad(dto);
    if (selectedJugadorId) await fetchHabilidades(selectedJugadorId);
  };

  const handleEliminar = async (habilidadId: number) => {
    if (!selectedJugadorId) return;
    await habilidadesService.eliminarHabilidad(selectedJugadorId, habilidadId);
    await fetchHabilidades(selectedJugadorId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" /> Habilidades de Jugadores (HU-GD-07)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Asignación y desvinculación de competencias técnicas por jugador.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Asignar Habilidad
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
        <label className="text-xs font-semibold text-slate-700">Seleccionar Jugador:</label>
        <select
          value={selectedJugadorId}
          onChange={(e) => setSelectedJugadorId(Number(e.target.value))}
          className="border rounded-lg p-2 text-xs font-medium flex-1 max-w-md"
        >
          {jugadores.map((j) => (
            <option key={j.id_jugador} value={j.id_jugador}>
              {j.nombre} {j.apellido || ''} (ID: {j.id_jugador})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando habilidades...</div>
      ) : habilidades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          Este jugador no tiene habilidades asignadas actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {habilidades.map((hj) => (
            <div key={hj.id_habilidad} className="bg-white p-4 rounded-xl border flex items-center justify-between shadow-sm">
              <div>
                <span className="font-bold text-slate-800 text-xs block">{hj.habilidad?.nombre || `Habilidad #${hj.id_habilidad}`}</span>
                <span className="text-[11px] text-slate-500">{hj.habilidad?.descripcion || 'Sin descripción'}</span>
              </div>
              <button onClick={() => handleEliminar(hj.id_habilidad)} className="text-rose-500 hover:text-rose-700 p-1.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AsignarHabilidadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAsignar}
        jugadorId={selectedJugadorId}
      />
    </div>
  );
};
