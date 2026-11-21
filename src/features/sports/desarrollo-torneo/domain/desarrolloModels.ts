import { Partido } from '../../partidos/domain/partidoModels';

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

export interface DesarrolloTorneo {
  torneo: { id_torneo: number; nombre: string };
  fases: { id_fase: number; nombre: string; tipo: 'GRUPO' | 'FINAL' }[];
  partidos: Partido[];
  tablaPosiciones: PosicionEquipo[];
}
