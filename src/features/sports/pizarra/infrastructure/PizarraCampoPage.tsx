import React, { useState, useEffect } from 'react';
import { Partido } from '../../partidos/domain/partidoModels';
import { partidosService } from '../../partidos/application/partidosService';
import { pizarraService, PosicionRemota } from '../application/pizarraService';
import { CampoDeportivoSvg } from './CampoDeportivoSvg';
import { PizarraEstado } from '../domain/pizarraModels';
import { Activity, Play } from 'lucide-react';

const norm = (v: number) => (v >= 0 && v <= 1 ? v * 100 : Math.min(100, Math.max(0, v)));

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

  useEffect(() => {
    if (!selectedPartido) return;
    const interval = setInterval(async () => {
      try {
        const ultimas = await pizarraService.getUltimasPosiciones(selectedPartido.id_partido);
        if (ultimas.length > 0) aplicarPosicionesRemotas(ultimas);
      } catch {
        // En caso de que no haya registradas aún, mantiene la alineación
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedPartido, pizarra]);

  const aplicarPosicionesRemotas = (ultimas: PosicionRemota[]) => {
    setPizarra((prev) => {
      if (!prev) return prev;
      const nuevoBalon = ultimas.find((u) => u.esPelota);
      const nuevosJugadores = prev.jugadores.map((j) => {
        const pos = ultimas.find((u) => u.jugadorId === j.id);
        return pos ? { ...j, x: norm(pos.x), y: norm(pos.y) } : j;
      });
      return {
        ...prev,
        balon: nuevoBalon ? { x: norm(nuevoBalon.x), y: norm(nuevoBalon.y) } : prev.balon,
        jugadores: nuevosJugadores,
      };
    });
  };

  const handleSimularJugada = async () => {
    if (!selectedPartido || !pizarra) return;
    const dx = (Math.random() - 0.5) * 10;
    const dy = (Math.random() - 0.5) * 10;
    const lote: Partial<PosicionRemota>[] = [
      { esPelota: true, x: Math.min(90, Math.max(10, pizarra.balon.x + dx)), y: Math.min(90, Math.max(10, pizarra.balon.y + dy)) },
      ...pizarra.jugadores.slice(0, 4).map((j) => ({
        jugadorId: j.id,
        x: Math.min(90, Math.max(10, j.x + (Math.random() - 0.5) * 6)),
        y: Math.min(90, Math.max(10, j.y + (Math.random() - 0.5) * 6)),
      })),
    ];
    await pizarraService.enviarLotePosiciones(selectedPartido.id_partido, lote);
    const ultimas = await pizarraService.getUltimasPosiciones(selectedPartido.id_partido);
    aplicarPosicionesRemotas(ultimas);
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
          <p className="text-xs text-slate-500 mt-1">Seguimiento 2D con historial de posiciones espaciales y recarga en vivo.</p>
        </div>
        <button
          onClick={handleSimularJugada}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Play className="w-3.5 h-3.5" /> Simular Jugada / Movimiento
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
        <label className="text-xs font-semibold text-slate-700">Encuentro:</label>
        <select
          value={selectedPartido?.id_partido || ''}
          onChange={(e) => {
            const p = partidos.find((item) => item.id_partido === Number(e.target.value));
            if (p) {
              setSelectedPartido(p);
              setPizarra(pizarraService.generarAlineacionDefault(p));
            }
          }}
          className="border rounded-lg p-2 text-xs font-medium flex-1 max-w-md"
        >
          {partidos.map((p) => {
            const l = p.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
            const v = p.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Visitante';
            return <option key={p.id_partido} value={p.id_partido}>[{p.estado}] {l} vs {v}</option>;
          })}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando pizarra...</div>
      ) : selectedPartido && pizarra ? (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-400">{selectedPartido.estado}</span>
            </div>
            <div className="flex items-center gap-4 text-center">
              <span className="text-sm font-bold">{local}</span>
              <span className="text-xl font-extrabold text-indigo-400">{selectedPartido.anotaciones?.length || 0}</span>
              <span className="text-xs text-slate-400">vs</span>
              <span className="text-sm font-bold">{visitante}</span>
            </div>
            <div className="text-xs text-slate-400">Min: <span className="text-white font-bold">{pizarra.minutoActual}'</span></div>
          </div>
          <CampoDeportivoSvg jugadores={pizarra.jugadores} balon={pizarra.balon} />
        </div>
      ) : null}
    </div>
  );
};
