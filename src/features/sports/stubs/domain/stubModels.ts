export interface TorneoOption {
  id_torneo: number;
  nombre: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface FaseOption {
  id_fase: number;
  nombre: string;
  tipo: 'GRUPO' | 'FINAL';
  id_torneo: number;
}

export interface EscenarioOption {
  id_escenario: number;
  nombre: string;
  direccion?: string;
}

export interface EquipoOption {
  id_equipo: number;
  nombre: string;
}

export interface JugadorOption {
  id_jugador: number;
  nombre: string;
  apellido?: string;
  id_posicion?: number;
}

export interface PelotaOption {
  id_pelota: number;
  referencia: string;
  marca?: string;
}

export interface HabilidadOption {
  id_habilidad: number;
  nombre: string;
  descripcion?: string;
}

export interface MetodoPagoCatalogoOption {
  id_metodo_pago: number;
  nombre: string;
}
