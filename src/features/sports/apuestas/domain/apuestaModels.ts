export type EstadoApuesta = 'REGISTRADA' | 'PENDIENTE' | 'GANADA' | 'PERDIDA' | 'ANULADA' | 'CANCELADA';

export interface Apuesta {
  id_apuesta: number;
  monto: number;
  fecha_hora: string;
  estado: EstadoApuesta;
  id_aficionado: number;
  id_partido: number;
  id_metodo_aficionado?: number | null;
  id_equipo_seleccionado?: number | null;
  equipoId?: number | null;
  partido?: {
    id_partido: number;
    estado: string;
    partidoEquipos?: { rol: string; equipo?: { nombre: string } }[];
  };
  aficionado?: {
    id_aficionado: number;
    nombre?: string;
    apellido?: string;
  };
}

export interface CreateApuestaDto {
  monto: number;
  id_aficionado?: number;
  aficionadoId?: number;
  id_partido?: number;
  partidoId?: number;
  id_metodo_aficionado?: number;
  metodoAficionadoId?: number;
  /** Equipo por el que se apuesta (obligatorio para poder liquidar). */
  id_equipo?: number;
  equipoId?: number;
}
