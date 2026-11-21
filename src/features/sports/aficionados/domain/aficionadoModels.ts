export interface Aficionado {
  id_aficionado: number;
  usuario_id: number;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fecha_registro: string;
}

export interface MetodoPagoAficionado {
  id_metodo_aficionado: number;
  id_aficionado: number;
  id_metodo_pago: number;
  referencia: string;
  metodoPago?: { id_metodo_pago: number; nombre: string };
}

export interface AficionadoEquipo {
  id_aficionado: number;
  id_equipo: number;
  equipo?: { id_equipo: number; nombre: string };
}
