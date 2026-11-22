export type EstadoBoleto = 'DISPONIBLE' | 'RESERVADO' | 'PAGADO' | 'CANCELADO';

export interface Localidad {
  id_localidad: number;
  nombre: string;
  capacidad: number;
  id_escenario: number;
}

export interface Boleto {
  id_boleto: number;
  codigo: string;
  precio: number;
  estado: EstadoBoleto;
  id_partido: number;
  id_localidad: number;
  id_aficionado?: number | null;
  localidad?: Localidad;
  partido?: {
    id_partido: number;
    partidoEquipos?: { rol: string; equipo?: { nombre: string } }[];
  };
}

export interface EmitirBoletoDto {
  codigo: string;
  precio: number;
  estado?: EstadoBoleto;
  id_partido?: number;
  partidoId?: number;
  id_localidad?: number;
  localidadId?: number;
  id_aficionado?: number;
  aficionadoId?: number;
}
