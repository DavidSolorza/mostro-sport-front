export interface JugadorTactico {
  id: number;
  dorsal: number;
  nombre: string;
  equipo: 'LOCAL' | 'VISITANTE';
  x: number; // 0 a 100 (% ancho)
  y: number; // 0 a 100 (% alto)
  posicion?: string; // POR, DEF, MED, DEL
}

export interface PelotaPosicion {
  x: number;
  y: number;
}

export interface EventoEnVivo {
  id: string;
  minuto: number;
  segundo: number;
  tipo: 'GOL' | 'TIRO' | 'FALTA' | 'CORNER' | 'PASE';
  equipo: 'LOCAL' | 'VISITANTE';
  descripcion: string;
  jugador?: string;
}

export interface EstadisticasPartido {
  posesionLocal: number;
  posesionVisitante: number;
  tirosLocal: number;
  tirosVisitante: number;
  tirosPuertaLocal: number;
  tirosPuertaVisitante: number;
  faltasLocal: number;
  faltasVisitante: number;
  cornersLocal: number;
  cornersVisitante: number;
}

export interface PizarraEstado {
  partidoId: number;
  minutoActual: number;
  segundoActual: number;
  periodo: '1T' | '2T' | 'FIN';
  marcadorLocal: number;
  marcadorVisitante: number;
  /** Anotaciones oficiales registradas en el backend (el marcador de la simulación es independiente). */
  golesOficiales: number;
  balon: PelotaPosicion;
  jugadores: JugadorTactico[];
  estadisticas: EstadisticasPartido;
  eventos: EventoEnVivo[];
}
