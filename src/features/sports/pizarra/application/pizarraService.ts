import { EventoEnVivo, JugadorTactico, PizarraEstado } from '../domain/pizarraModels';
import { Anotacion, Partido } from '../../partidos/domain/partidoModels';
import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray } from '../../shared/pagination';
import { simuladorJugadasService } from './simuladorJugadasService';

export interface PosicionRemota {
  jugadorId?: number;
  esPelota?: boolean;
  x: number;
  y: number;
  timestamp: string;
}

interface EquipoJugadorApi {
  jugadorId?: number;
  id_jugador?: number;
  jugador?: { id?: number; id_jugador?: number; nombre?: string; apellido?: string; numeroCamiseta?: number };
}

export const deApiAPorcentaje = (v: number): number =>
  v >= 0 && v <= 1 ? Math.min(96, Math.max(4, v * 100)) : Math.min(96, Math.max(4, v));

export const dePorcentajeAApi = (v: number): number =>
  Number((Math.min(100, Math.max(0, v)) / 100).toFixed(4));

function mapearPlantilla(lista: EquipoJugadorApi[], equipo: 'LOCAL' | 'VISITANTE', base: JugadorTactico[]): JugadorTactico[] {
  const slots = base.filter((b) => b.equipo === equipo);
  if (!lista.length) return slots;
  return lista.slice(0, 11).map((item, idx) => {
    const j = item.jugador;
    const id = Number(j?.id ?? j?.id_jugador ?? item.jugadorId ?? item.id_jugador ?? slots[idx % slots.length].id);
    const slot = slots[idx % slots.length];
    const nombre = j?.nombre ? `${j.nombre}${j.apellido ? ' ' + j.apellido[0] + '.' : ''}` : slot.nombre;
    return {
      id,
      dorsal: j?.numeroCamiseta ?? idx + 1,
      nombre,
      equipo,
      x: slot.x,
      y: slot.y,
      posicion: slot.posicion,
    };
  });
}

export const pizarraService = {
  generarAlineacionDefault(partido: Partido): PizarraEstado {
    const base = simuladorJugadasService.crearEstadoInicial(partido.id_partido);
    const goles = partido.anotaciones?.length || 0;
    const periodo = partido.estado === 'FINALIZADO' || partido.estado === 'CANCELADO' ? 'FIN' : goles > 2 ? '2T' : '1T';
    return {
      ...base,
      partidoId: partido.id_partido,
      minutoActual: partido.estado === 'PROGRAMADO' ? 0 : Math.min(90, Math.max(1, goles * 15)),
      segundoActual: 0,
      periodo,
      golesOficiales: goles,
    };
  },

  async cargarEstadoReal(partido: Partido): Promise<PizarraEstado> {
    const base = this.generarAlineacionDefault(partido);
    const localId = partido.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.id_equipo;
    const visId = partido.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.id_equipo;

    const [jugLocal, jugVis, anotaciones, ultimas] = await Promise.all([
      localId ? sportsHttpClient.get<EquipoJugadorApi[]>(`/equipos/${localId}/jugadores`).catch(() => [] as EquipoJugadorApi[]) : Promise.resolve([] as EquipoJugadorApi[]),
      visId ? sportsHttpClient.get<EquipoJugadorApi[]>(`/equipos/${visId}/jugadores`).catch(() => [] as EquipoJugadorApi[]) : Promise.resolve([] as EquipoJugadorApi[]),
      sportsHttpClient.get<Anotacion[]>(`/partidos/${partido.id_partido}/anotaciones`).catch(() => [] as Anotacion[]),
      this.getUltimasPosiciones(partido.id_partido).catch(() => [] as PosicionRemota[]),
    ]);

    const plantillaLocal = mapearPlantilla(asArray(jugLocal), 'LOCAL', base.jugadores);
    const plantillaVis = mapearPlantilla(asArray(jugVis), 'VISITANTE', base.jugadores);
    const idsLocal = new Set(plantillaLocal.map((j) => j.id));
    const idsVis = new Set(plantillaVis.map((j) => j.id));

    const listaAnot = asArray(anotaciones);
    let marcadorLocal = 0;
    let marcadorVisitante = 0;
    const eventosReales: EventoEnVivo[] = listaAnot.map((a, idx) => {
      const jId = Number((a as unknown as { jugadorId?: number }).jugadorId ?? a.id_jugador);
      const eq: 'LOCAL' | 'VISITANTE' = idsVis.has(jId) && !idsLocal.has(jId) ? 'VISITANTE' : 'LOCAL';
      if (eq === 'LOCAL') marcadorLocal += 1;
      else marcadorVisitante += 1;
      return {
        id: `anot-${a.id_anotacion ?? idx}`,
        minuto: a.minuto ?? 0,
        segundo: 0,
        tipo: 'GOL',
        equipo: eq,
        descripcion: a.descripcion || 'Anotación oficial registrada',
        jugador: a.jugador?.nombre,
      };
    });

    const jugadores = this.aplicarPosicionesAJugadores([...plantillaLocal, ...plantillaVis], ultimas);
    const balonPos = ultimas.find((u) => u.esPelota);

    return {
      ...base,
      jugadores,
      balon: balonPos ? { x: deApiAPorcentaje(balonPos.x), y: deApiAPorcentaje(balonPos.y) } : base.balon,
      marcadorLocal,
      marcadorVisitante,
      golesOficiales: listaAnot.length,
      eventos: eventosReales.length ? eventosReales.reverse() : base.eventos,
      ultimaSincronizacion: new Date().toLocaleTimeString(),
    };
  },

  aplicarPosicionesAJugadores(jugadores: JugadorTactico[], ultimas: PosicionRemota[]): JugadorTactico[] {
    if (!ultimas.length) return jugadores;
    return jugadores.map((j) => {
      const p = ultimas.find((u) => !u.esPelota && Number(u.jugadorId) === Number(j.id));
      return p ? { ...j, x: deApiAPorcentaje(p.x), y: deApiAPorcentaje(p.y) } : j;
    });
  },

  async getUltimasPosiciones(partidoId: number): Promise<PosicionRemota[]> {
    return sportsHttpClient.get<PosicionRemota[]>(`/partidos/${partidoId}/posiciones/ultimas`);
  },

  async enviarLotePosiciones(partidoId: number, posiciones: Partial<PosicionRemota>[]): Promise<PosicionRemota[]> {
    const normalizadas = posiciones.map((p) => ({
      ...p,
      x: p.x !== undefined ? dePorcentajeAApi(p.x) : 0.5,
      y: p.y !== undefined ? dePorcentajeAApi(p.y) : 0.5,
    }));
    return sportsHttpClient.post<PosicionRemota[]>(`/partidos/${partidoId}/posiciones`, { posiciones: normalizadas });
  },
};
