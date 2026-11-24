export interface JugadorTactico {
  id: number;
  dorsal: number;
  nombre: string;
  equipo: 'LOCAL' | 'VISITANTE';
  x: number; // 0 a 100 (% ancho en pizarra)
  y: number; // 0 a 100 (% alto en pizarra)
  posicion?: string;
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

export type ModoPizarra = 'EN_VIVO_API' | 'SIMULADOR';

export interface PizarraEstado {
  partidoId: number;
  minutoActual: number;
  segundoActual: number;
  periodo: '1T' | '2T' | 'FIN';
  marcadorLocal: number;
  marcadorVisitante: number;
  golesOficiales: number;
  balon: PelotaPosicion;
  jugadores: JugadorTactico[];
  estadisticas: EstadisticasPartido;
  eventos: EventoEnVivo[];
  ultimaSincronizacion?: string;
}
