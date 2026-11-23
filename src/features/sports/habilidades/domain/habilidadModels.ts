export interface HabilidadJugador {
  id_jugador: number;
  id_habilidad: number;
  jugador?: { id_jugador: number; nombre: string; apellido?: string };
  habilidad?: { id_habilidad: number; nombre: string; descripcion?: string };
}

export interface AsignarHabilidadDto {
  id_jugador: number;
  id_habilidad: number;
}
