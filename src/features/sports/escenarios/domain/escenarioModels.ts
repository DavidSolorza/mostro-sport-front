export interface Escenario {
  id: number;
  nombre: string;
  direccion?: string | null;
  escenarioPadreId?: number | null;
  escenarioPadre?: { id: number; nombre: string } | null;
  activo?: boolean;
}

export interface EscenarioFiltros {
  nombre?: string;
  activo?: '' | 'true' | 'false';
  soloRaiz?: boolean | '';
}

export interface CreateEscenarioDto {
  nombre: string;
  direccion?: string;
  escenarioPadreId?: number;
}

export type UpdateEscenarioDto = Partial<CreateEscenarioDto>;

export interface CreateSubescenarioDto {
  nombre: string;
  direccion?: string;
}
