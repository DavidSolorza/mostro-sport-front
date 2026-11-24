export interface HabilidadJugador {
  id_jugador: number;
  id_habilidad: number;
  nivel?: number | null;
  jugador?: { id_jugador: number; nombre: string; apellido?: string };
  habilidad?: { id_habilidad: number; nombre: string; descripcion?: string };
}

/** Forma cruda que devuelve ms_negocio (camelCase, ids como `id`). */
export interface HabilidadJugadorRaw {
  jugadorId?: number;
  habilidadId?: number;
  id_jugador?: number;
  id_habilidad?: number;
  nivel?: number | null;
  habilidadNombre?: string;
  habilidadDescripcion?: string;
  jugador?: { id?: number; id_jugador?: number; nombre: string; apellido?: string };
  habilidad?: { id?: number; id_habilidad?: number; nombre: string; descripcion?: string };
}

export interface AsignarHabilidadDto {
  jugadorId: number;
  habilidadId: number;
  nivel?: number;
}
