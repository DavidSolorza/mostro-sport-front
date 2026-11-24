export interface Deporte {
  id: number;
  nombre: string;
  descripcion?: string | null;
  deportePadreId?: number | null;
  activo?: boolean;
}
