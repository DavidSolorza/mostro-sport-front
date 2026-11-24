import { Equipo } from '../../equipos/domain/equipoModels';

export type EstadoTorneo = 'INSCRIPCIONES_ABIERTAS' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

export const ESTADOS_TORNEO: EstadoTorneo[] = ['INSCRIPCIONES_ABIERTAS', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'];

export const ESTADO_TORNEO_LABEL: Record<EstadoTorneo, string> = {
  INSCRIPCIONES_ABIERTAS: 'Inscripciones abiertas',
  EN_CURSO: 'En curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export interface Torneo {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaCierreInscripciones?: string | null;
  deporteId?: number;
  deporte?: { id: number; nombre: string } | null;
  estado: EstadoTorneo;
  activo?: boolean;
}

export interface TorneoFiltros {
  nombre?: string;
  estado?: EstadoTorneo | '';
  deporteId?: number | '';
}

export interface CreateTorneoDto {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  fechaCierreInscripciones?: string;
  deporteId: number;
}

export type UpdateTorneoDto = Partial<CreateTorneoDto>;

export interface Inscripcion {
  equipoId?: number;
  torneoId?: number;
  equipo?: { id: number; nombre: string };
  fechaInscripcion?: string | null;
  fecha?: string | null;
}

// Fases: entidad solo-API (sin interfaz); aqui solo se leen.
export type TipoFase = 'GRUPO' | 'GRUPOS' | 'FINAL';

export interface Fase {
  id: number;
  nombre: string;
  tipo: TipoFase;
  orden?: number;
  torneoId?: number;
}

export interface Grupo {
  id: number;
  nombreGrupo: string;
  equipos?: Equipo[];
}

export interface FaseEstructura extends Fase {
  grupos?: Grupo[];
}

export interface TorneoEstructura {
  torneo?: Torneo;
  fases?: FaseEstructura[];
}

export type ModalidadFinal = 'OCTAVOS' | 'CUARTOS' | 'SEMIFINAL' | 'FINAL';

export const MODALIDADES_FINAL: ModalidadFinal[] = ['OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

export interface FaseFinal {
  torneoId?: number;
  faseId: number;
  modalidad: ModalidadFinal;
  fase?: Fase;
}

