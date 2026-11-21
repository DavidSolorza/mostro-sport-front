import React, { useState, useEffect } from 'react';
import { Partido } from '../../partidos/domain/partidoModels';
import { partidosService } from '../../partidos/application/partidosService';
import { pizarraService } from '../application/pizarraService';
import { CampoDeportivoSvg } from './CampoDeportivoSvg';
import { PizarraEstado } from '../domain/pizarraModels';
import { Activity } from 'lucide-react';

export const PizarraCampoPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [selectedPartido, setSelectedPartido] = useState<Partido | null>(null);
  const [pizarra, setPizarra] = useState<PizarraEstado | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    partidosService.getPartidos().then((data) => {
      setPartidos(data);
      const enCurso = data.find((p) => p.estado === 'EN_CURSO') || data[0];
      if (enCurso) {
        setSelectedPartido(enCurso);
        setPizarra(pizarraService.generarAlineacionDefault(enCurso));
      }
      setLoading(false);
    });
  }, []);

  const handleSelectPartido = (p: Partido) => {
    setSelectedPartido(p);
    setPizarra(pizarraService.generarAlineacionDefault(p));
  };

  const local = selectedPartido?.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
  const visitante = selectedPartido?.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Visitante';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Pizarra Táctica en Vivo (HU-GC-09)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualización interactiva 2D del terreno de juego con alineaciones y posición del balón.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
        <label className="text-xs font-semibold text-slate-700">Seleccionar Encuentro:</label>
        <select
          value={selectedPartido?.id_partido || ''}
          onChange={(e) => {
            const p = partidos.find((item) => item.id_partido === Number(e.target.value));
            if (p) handleSelectPartido(p);
          }}
          className="border rounded-lg p-2 text-xs font-medium flex-1 max-w-md"
        >
          {partidos.map((p) => {
            const l = p.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
            const v = p.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Visitante';
            return (
              <option key={p.id_partido} value={p.id_partido}>
                [{p.estado}] {l} vs {v} ({p.torneo?.nombre || `Torneo #${p.id_torneo}`})
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando pizarra táctica...</div>
      ) : selectedPartido && pizarra ? (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {selectedPartido.estado}
              </span>
            </div>
            <div className="flex items-center gap-4 text-center">
              <span className="text-sm font-bold">{local}</span>
              <span className="text-xl font-extrabold text-indigo-400">
                {selectedPartido.anotaciones?.length || 0}
              </span>
              <span className="text-xs text-slate-400">vs</span>
              <span className="text-sm font-bold">{visitante}</span>
            </div>
            <div className="text-xs text-slate-400">
              Minuto: <span className="text-white font-bold">{pizarra.minutoActual}'</span>
            </div>
          </div>

          <CampoDeportivoSvg jugadores={pizarra.jugadores} balon={pizarra.balon} />
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          No hay encuentros registrados para visualizar en la pizarra.
        </div>
      )}
    </div>
  );
};
