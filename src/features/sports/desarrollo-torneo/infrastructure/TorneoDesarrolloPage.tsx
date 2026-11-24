import React, { useState, useEffect } from 'react';
import { desarrolloService } from '../application/desarrolloService';
import { DesarrolloTorneo, PosicionEquipo } from '../domain/desarrolloModels';
import { TablaPosicionesView } from './TablaPosicionesView';
import { stubsService } from '../../stubs/application/stubsService';
import { TorneoOption } from '../../stubs/domain/stubModels';
import { BarChart3 } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';

export const TorneoDesarrolloPage: React.FC = () => {
  const [torneos, setTorneos] = useState<TorneoOption[]>([]);
  const [selectedTorneoId, setSelectedTorneoId] = useState<number>(0);
  const [data, setData] = useState<DesarrolloTorneo | null>(null);
  const [posiciones, setPosiciones] = useState<PosicionEquipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    stubsService
      .getTorneos()
      .then((t) => {
        setTorneos(t);
        if (t.length > 0) setSelectedTorneoId(t[0].id_torneo);
      })
      .catch((err) => {
        setError(toUserMessage(err));
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedTorneoId) {
      if (torneos.length === 0) setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      desarrolloService.getDesarrolloTorneo(selectedTorneoId),
      desarrolloService.getTablaPosiciones(selectedTorneoId),
    ])
      .then(([res, tabla]) => {
        setData(res);
        setPosiciones(tabla);
      })
      .catch((err) => {
        setData(null);
        setPosiciones([]);
        setError(toUserMessage(err));
      })
      .finally(() => setLoading(false));
  }, [selectedTorneoId, torneos.length]);

  const totalPartidos = (data?.fases ?? []).reduce(
    (acc, f) => acc + (f.partidosConResultado?.length ?? 0) + (f.partidosPendientes?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Desarrollo del Torneo (HU-GC-08b)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Seguimiento de fases, tabla clasificatoria en tiempo real y resultados acumulados.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Torneo:</label>
          <select
            value={selectedTorneoId}
            onChange={(e) => setSelectedTorneoId(Number(e.target.value))}
            className="border rounded-lg p-2 text-xs font-semibold bg-white"
          >
            {torneos.map((t) => (
              <option key={t.id_torneo} value={t.id_torneo}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando desarrollo del torneo...</div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fases Registradas</span>
              <p className="text-xl font-extrabold text-slate-800 mt-1">{data.fases?.length || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Partidos Programados</span>
              <p className="text-xl font-extrabold text-indigo-600 mt-1">{totalPartidos}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Equipos en Clasificación</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">{posiciones.length}</p>
            </div>
          </div>

          <TablaPosicionesView posiciones={posiciones} />
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          No hay datos de desarrollo disponibles para este torneo.
        </div>
      )}
    </div>
  );
};
