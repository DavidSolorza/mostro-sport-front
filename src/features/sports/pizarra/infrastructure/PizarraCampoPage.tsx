import React, { useState, useEffect } from 'react';
import { Partido } from '../../partidos/domain/partidoModels';
import { partidosService } from '../../partidos/application/partidosService';
import { usePizarraSimulacion } from '../application/usePizarraSimulacion';
import { CampoDeportivoSvg } from './CampoDeportivoSvg';
import { JugadoresCapaTactico } from './JugadoresCapaTactico';
import { TableroMarcadorVivo } from './TableroMarcadorVivo';
import { ControlesSimulacionBar } from './ControlesSimulacionBar';
import { FeedEventosEnVivo } from './FeedEventosEnVivo';
import { EstadisticasPartidoPanel } from './EstadisticasPartidoPanel';

const nombreEquipo = (p: Partido | null, rol: 'LOCAL' | 'VISITANTE') =>
  p?.partidoEquipos?.find((pe) => pe.rol === rol)?.equipo?.nombre || (rol === 'LOCAL' ? 'Local' : 'Visitante');

export const PizarraCampoPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [selected, setSelected] = useState<Partido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = usePizarraSimulacion(selected);

  useEffect(() => {
    partidosService
      .getPartidos()
      .then((data) => {
        setPartidos(data);
        const inicial = data.find((p) => p.estado === 'EN_CURSO') || data[0];
        if (inicial) {
          setSelected(inicial);
          t.cargar(inicial);
        }
      })
      .catch(() => setError('No se pudieron cargar los partidos. Verifica tu conexión o permisos.'))
      .finally(() => setLoading(false));
  }, []);

  const local = nombreEquipo(selected, 'LOCAL');
  const visitante = nombreEquipo(selected, 'VISITANTE');

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight">Tablero Táctico en Vivo</h1>
          <p className="text-xs text-slate-500">Simulación deportiva 2D, historial espacial y estadísticas.</p>
        </div>
        <select
          value={selected?.id_partido || ''}
          onChange={(e) => {
            const p = partidos.find((item) => item.id_partido === Number(e.target.value));
            if (p) {
              setSelected(p);
              t.cargar(p);
            }
          }}
          className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold bg-slate-50 shadow-xs"
        >
          {partidos.map((p) => (
            <option key={p.id_partido} value={p.id_partido}>
              [{p.estado}] {nombreEquipo(p, 'LOCAL')} vs {nombreEquipo(p, 'VISITANTE')}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-xs">Cargando tablero y alineaciones...</div>}
      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">{error}</div>}
      {!loading && !error && partidos.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-xs">No hay partidos registrados para mostrar en el tablero.</div>
      )}

      {selected && t.pizarra && (
        <div className="space-y-4">
          <TableroMarcadorVivo
            localNombre={local}
            visitanteNombre={visitante}
            marcadorLocal={t.pizarra.marcadorLocal}
            marcadorVisitante={t.pizarra.marcadorVisitante}
            golesOficiales={t.pizarra.golesOficiales}
            modo={t.modo}
            ultimaSincronizacion={t.pizarra.ultimaSincronizacion}
            minuto={t.pizarra.minutoActual}
            segundo={t.pizarra.segundoActual}
            periodo={t.pizarra.periodo}
            estado={selected.estado}
            torneoNombre={selected.torneo?.nombre}
            escenarioNombre={selected.escenario?.nombre}
          />
          <div className="relative w-full aspect-[16/10] bg-emerald-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
            <CampoDeportivoSvg />
            <JugadoresCapaTactico jugadores={t.pizarra.jugadores} balon={t.pizarra.balon} mostrarGol={t.mostrarGol} />
          </div>
          <ControlesSimulacionBar
            modo={t.modo}
            simulando={t.simulando}
            velocidad={t.velocidad}
            onCambiarModo={t.setModo}
            onToggleSimulacion={t.toggleSimulacion}
            onCambiarVelocidad={t.setVelocidad}
            onSimularPase={t.pase}
            onSimularRemate={t.rematar}
            onRestablecer={t.restablecer}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeedEventosEnVivo eventos={t.pizarra.eventos} />
            <EstadisticasPartidoPanel stats={t.pizarra.estadisticas} localNombre={local} visitanteNombre={visitante} />
          </div>
        </div>
      )}
    </div>
  );
};
