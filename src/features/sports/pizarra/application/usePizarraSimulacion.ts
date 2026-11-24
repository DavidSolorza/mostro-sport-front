import { useEffect, useRef, useState } from 'react';
import { Partido } from '../../partidos/domain/partidoModels';
import { ModoPizarra, PizarraEstado } from '../domain/pizarraModels';
import { deApiAPorcentaje, pizarraService } from '../application/pizarraService';
import { simuladorJugadasService as sim } from '../application/simuladorJugadasService';

/** Orquesta el tablero en vivo: polling real al backend o simulador con envío normalizado (0..1). */
export function usePizarraSimulacion(partido: Partido | null) {
  const [pizarra, setPizarra] = useState<PizarraEstado | null>(null);
  const [modo, setModo] = useState<ModoPizarra>('EN_VIVO_API');
  const [simulando, setSimulando] = useState(true);
  const [velocidad, setVelocidad] = useState(1);
  const [mostrarGol, setMostrarGol] = useState(false);
  const syncTimer = useRef<number | null>(null);

  const cargar = async (p: Partido) => {
    setPizarra(pizarraService.generarAlineacionDefault(p));
    try {
      const real = await pizarraService.cargarEstadoReal(p);
      setPizarra(real);
    } catch {
      /* mantiene la alineación por defecto si falla la carga */
    }
  };

  // Modo EN_VIVO_API: polling periódico a posiciones y anotaciones reales
  useEffect(() => {
    if (!partido || modo !== 'EN_VIVO_API' || !simulando) return;
    const poll = async () => {
      try {
        const ultimas = await pizarraService.getUltimasPosiciones(partido.id_partido);
        setPizarra((prev) => {
          if (!prev) return prev;
          const balonPos = ultimas.find((u) => u.esPelota);
          return {
            ...prev,
            jugadores: pizarraService.aplicarPosicionesAJugadores(prev.jugadores, ultimas),
            balon: balonPos ? { x: deApiAPorcentaje(balonPos.x), y: deApiAPorcentaje(balonPos.y) } : prev.balon,
            ultimaSincronizacion: new Date().toLocaleTimeString(),
          };
        });
      } catch {
        /* mantiene último estado visible */
      }
    };
    const timer = setInterval(poll, 2500);
    return () => clearInterval(timer);
  }, [partido, modo, simulando]);

  // Modo SIMULADOR: genera movimiento táctico solo si no está finalizado o en pausa
  useEffect(() => {
    if (!partido || modo !== 'SIMULADOR' || !simulando) return;
    if (partido.estado === 'FINALIZADO' || partido.estado === 'CANCELADO') return;
    const timer = setInterval(
      () => setPizarra((prev) => (prev ? sim.simularMovimiento(prev) : prev)),
      velocidad === 2 ? 600 : 1200,
    );
    return () => clearInterval(timer);
  }, [partido, modo, simulando, velocidad]);

  // En modo SIMULADOR envía lotes normalizados (0.0..1.0) al backend
  useEffect(() => {
    if (!partido || !pizarra || modo !== 'SIMULADOR') return;
    syncTimer.current = window.setTimeout(async () => {
      try {
        await pizarraService.enviarLotePosiciones(partido.id_partido, [
          { esPelota: true, x: pizarra.balon.x, y: pizarra.balon.y },
          ...pizarra.jugadores.slice(0, 6).map((j) => ({ jugadorId: j.id, x: j.x, y: j.y })),
        ]);
        setPizarra((prev) => (prev ? { ...prev, ultimaSincronizacion: new Date().toLocaleTimeString() } : prev));
      } catch {
        /* sin conexión */
      }
    }, 3000);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [pizarra?.balon.x, pizarra?.balon.y, partido, modo]);

  const rematar = (equipo: 'LOCAL' | 'VISITANTE') => {
    if (!pizarra) return;
    setModo('SIMULADOR');
    const { estado, esGol } = sim.dispararRemate(pizarra, equipo);
    setPizarra(estado);
    if (esGol) {
      setMostrarGol(true);
      setTimeout(() => setMostrarGol(false), 2400);
    }
  };

  return {
    pizarra,
    modo,
    simulando,
    velocidad,
    mostrarGol,
    cargar,
    setModo,
    setVelocidad,
    rematar,
    toggleSimulacion: () => setSimulando((s) => !s),
    pase: () => {
      setModo('SIMULADOR');
      setPizarra((p) => (p ? sim.simularMovimiento(p) : p));
    },
    restablecer: () => partido && cargar(partido),
  };
}
