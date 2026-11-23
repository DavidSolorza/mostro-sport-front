import { useEffect, useRef, useState } from 'react';
import { Partido } from '../../partidos/domain/partidoModels';
import { PizarraEstado } from '../domain/pizarraModels';
import { pizarraService } from '../application/pizarraService';
import { simuladorJugadasService as sim } from '../application/simuladorJugadasService';

/** Orquesta el estado del tablero: simulación, sincronización con el backend y eventos de gol. */
export function usePizarraSimulacion(partido: Partido | null) {
  const [pizarra, setPizarra] = useState<PizarraEstado | null>(null);
  const [simulando, setSimulando] = useState(true);
  const [velocidad, setVelocidad] = useState(1);
  const [mostrarGol, setMostrarGol] = useState(false);
  const syncTimer = useRef<number | null>(null);

  const cargar = (p: Partido) => setPizarra(pizarraService.generarAlineacionDefault(p));

  useEffect(() => {
    if (!simulando || !partido) return;
    const timer = setInterval(
      () => setPizarra((prev) => (prev ? sim.simularMovimiento(prev) : prev)),
      velocidad === 2 ? 600 : 1200,
    );
    return () => clearInterval(timer);
  }, [simulando, velocidad, partido]);

  // Sincronización periódica de posiciones con el backend (falla en silencio en modo demo)
  useEffect(() => {
    if (!partido || !pizarra) return;
    syncTimer.current = window.setTimeout(async () => {
      try {
        await pizarraService.enviarLotePosiciones(partido.id_partido, [
          { esPelota: true, x: pizarra.balon.x, y: pizarra.balon.y },
          ...pizarra.jugadores.slice(0, 4).map((j) => ({ jugadorId: j.id, x: j.x, y: j.y })),
        ]);
      } catch {
        /* sin conexión: se mantiene la simulación local */
      }
    }, 4000);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [pizarra?.balon.x, pizarra?.balon.y, partido]);

  const rematar = (equipo: 'LOCAL' | 'VISITANTE') => {
    if (!pizarra) return;
    const { estado, esGol } = sim.dispararRemate(pizarra, equipo);
    setPizarra(estado);
    if (esGol) {
      setMostrarGol(true);
      setTimeout(() => setMostrarGol(false), 2400);
    }
  };

  return {
    pizarra,
    simulando,
    velocidad,
    mostrarGol,
    cargar,
    setVelocidad,
    rematar,
    toggleSimulacion: () => setSimulando((s) => !s),
    pase: () => setPizarra((p) => (p ? sim.simularMovimiento(p) : p)),
    restablecer: () => partido && cargar(partido),
  };
}
