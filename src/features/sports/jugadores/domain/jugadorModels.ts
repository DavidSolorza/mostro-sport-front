import { EquipoJugador } from '../../equipos/domain/equipoModels';

export interface Jugador {
  id: number;
  nombre: string;
  apellido?: string | null;
  documento: string;
  fechaNacimiento?: string | null;
  posicionId?: number | null;
  posicion?: { id: number; nombre: string } | null;
  activo?: boolean;
}

export interface JugadorFiltros {
  nombre?: string;
  documento?: string;
  activo?: '' | 'true' | 'false';
}

export interface CreateJugadorDto {
  nombre: string;
  apellido?: string;
  documento: string;
  fechaNacimiento?: string;
  posicionId?: number;
}

export type UpdateJugadorDto = Partial<CreateJugadorDto>;

export interface PosicionEspacialOption {
  id: number;
  nombre: string;
}

export interface HabilidadDeJugador {
  habilidadId?: number;
  nombre?: string;
  nivel?: number | null;
  habilidad?: { id: number; nombre: string };
}

export interface JugadorPerfil {
  jugador?: Jugador;
  equipos?: EquipoJugador[];
  habilidades?: HabilidadDeJugador[];
  // El backend puede devolver los datos básicos aplanados.
  id?: number;
  nombre?: string;
  apellido?: string | null;
  documento?: string;
  fechaNacimiento?: string | null;
  posicion?: { id: number; nombre: string } | null;
}
