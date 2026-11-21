export interface JugadorTactico {
  id: number;
  nombre: string;
  equipo: 'LOCAL' | 'VISITANTE';
  x: number; // 0 a 100 (% ancho de cancha)
  y: number; // 0 a 100 (% alto de cancha)
  posicion?: string;
}

export interface PelotaPosicion {
  x: number;
  y: number;
}

export interface PizarraEstado {
  partidoId: number;
  minutoActual: number;
  balon: PelotaPosicion;
  jugadores: JugadorTactico[];
}
