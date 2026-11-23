export type EstadoPartido = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

export interface PartidoEquipo {
  id_partido: number;
  id_equipo: number;
  rol: 'LOCAL' | 'VISITANTE';
  equipo?: { id_equipo: number; nombre: string };
}

export interface Anotacion {
  id_anotacion: number;
  minuto: number;
  descripcion: string;
  id_partido: number;
  id_jugador: number;
  jugador?: { id_jugador: number; nombre: string; apellido?: string };
}

export interface Partido {
  id_partido: number;
  fecha_hora: string;
  estado: EstadoPartido;
  id_torneo: number;
  id_fase?: number | null;
  id_escenario: number;
  id_pelota?: number | null;
  partidoEquipos?: PartidoEquipo[];
  anotaciones?: Anotacion[];
  escenario?: { id_escenario: number; nombre: string };
  pelota?: { id_pelota: number; referencia: string };
  torneo?: { id_torneo: number; nombre: string };
  fase?: { id_fase: number; nombre: string };
}

export interface CreatePartidoDto {
  fecha_hora: string;
  id_torneo: number;
  id_fase?: number;
  id_escenario: number;
  id_pelota?: number;
  id_equipo_local: number;
  id_equipo_visitante: number;
}

export interface RegistrarAnotacionDto {
  id_partido: number;
  id_jugador: number;
  minuto: number;
  descripcion: string;
}

export interface FinalizarPartidoDto {
  id_equipo_ganador?: number;
  es_empate?: boolean;
}
