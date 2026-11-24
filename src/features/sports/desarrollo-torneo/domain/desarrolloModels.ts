export interface PosicionEquipo {
  equipoId: number;
  nombre: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  puntos: number;
}

export interface PartidoDesarrollo {
  id: number;
  fechaHora?: string;
  torneoId?: number;
  faseId?: number;
  estado?: string;
  [key: string]: unknown;
}

export interface FaseDesarrollo {
  faseId: number;
  nombre: string;
  tipo: 'GRUPO' | 'GRUPOS' | 'FINAL';
  orden: number;
  partidosConResultado: PartidoDesarrollo[];
  partidosPendientes: PartidoDesarrollo[];
}

export interface DesarrolloTorneo {
  torneoId: number;
  nombre: string;
  estado: string;
  fases: FaseDesarrollo[];
}
