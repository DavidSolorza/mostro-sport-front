export type GeneroEquipo = 'MASCULINO' | 'FEMENINO' | 'MIXTO';

export const GENEROS_EQUIPO: GeneroEquipo[] = ['MASCULINO', 'FEMENINO', 'MIXTO'];

export interface Equipo {
  id: number;
  nombre: string;
  genero?: GeneroEquipo | null;
  fechaCreacion?: string | null;
  activo?: boolean;
}

export interface EquipoFiltros {
  nombre?: string;
  genero?: GeneroEquipo | '';
  activo?: '' | 'true' | 'false';
}

export interface CreateEquipoDto {
  nombre: string;
  genero?: GeneroEquipo;
  fechaCreacion?: string;
}

export type UpdateEquipoDto = Partial<CreateEquipoDto>;

export interface EquipoJugador {
  jugadorId: number;
  equipoId?: number;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  jugador?: { id: number; nombre: string; apellido?: string | null; documento?: string };
  equipo?: { id: number; nombre: string };
}

export interface AsociarJugadorDto {
  jugadorId: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ActualizarVinculoDto {
  fechaInicio?: string;
  fechaFin?: string;
}
