import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { Aficionado, MetodoPagoAficionado, AficionadoEquipo } from '../domain/aficionadoModels';

interface MetodoRaw extends Partial<MetodoPagoAficionado> {
  id?: number;
  aficionadoId?: number;
  metodoPagoId?: number;
  metodoPagoNombre?: string;
}

interface EquipoFavRaw extends Partial<AficionadoEquipo> {
  aficionadoId?: number;
  equipoId?: number;
  equipoNombre?: string;
}

const normalizarMetodo = (r: MetodoRaw): MetodoPagoAficionado => ({
  id_metodo_aficionado: Number(r.id_metodo_aficionado ?? r.id ?? 0),
  referencia: r.referencia ?? '',
  id_aficionado: Number(r.id_aficionado ?? r.aficionadoId ?? 0),
  id_metodo_pago: Number(r.id_metodo_pago ?? r.metodoPagoId ?? 0),
  metodoPago: r.metodoPago ?? {
    id_metodo_pago: Number(r.id_metodo_pago ?? r.metodoPagoId ?? 0),
    nombre: r.metodoPagoNombre || 'Método de Pago',
  },
});

const normalizarFav = (r: EquipoFavRaw): AficionadoEquipo => ({
  id_aficionado: Number(r.id_aficionado ?? r.aficionadoId ?? 0),
  id_equipo: Number(r.id_equipo ?? r.equipoId ?? 0),
  equipo: r.equipo ?? {
    id_equipo: Number(r.id_equipo ?? r.equipoId ?? 0),
    nombre: r.equipoNombre || `Equipo #${r.equipoId ?? r.id_equipo}`,
  },
});

export const aficionadosService = {
  async getAficionadoByUsuarioId(usuarioId: number): Promise<Aficionado> {
    return sportsHttpClient.get<Aficionado>(`/aficionados/usuario/${usuarioId}`);
  },

  async registrarAficionado(dto: { usuario_id: number; nombre: string; apellido?: string; telefono?: string }): Promise<Aficionado> {
    return sportsHttpClient.post<Aficionado>('/aficionados', dto);
  },

  async getMetodosPago(aficionadoId: number): Promise<MetodoPagoAficionado[]> {
    const res = await sportsHttpClient.get<MetodoRaw[]>(`/metodos-pago-aficionado/${aficionadoId}`);
    return (res ?? []).map(normalizarMetodo);
  },

  async asociarMetodoPago(dto: { id_aficionado: number; id_metodo_pago: number; referencia: string }): Promise<MetodoPagoAficionado> {
    const res = await sportsHttpClient.post<MetodoRaw>('/metodos-pago-aficionado', dto);
    return normalizarMetodo(res);
  },

  async eliminarMetodoPago(id: number): Promise<void> {
    return sportsHttpClient.delete(`/metodos-pago-aficionado/${id}`);
  },

  async getEquiposFavoritos(aficionadoId: number): Promise<AficionadoEquipo[]> {
    const res = await sportsHttpClient.get<EquipoFavRaw[]>(`/aficionados-equipos/${aficionadoId}`);
    return (res ?? []).map(normalizarFav);
  },

  async vincularEquipoFavorito(dto: { id_aficionado: number; id_equipo: number }): Promise<AficionadoEquipo> {
    const res = await sportsHttpClient.post<EquipoFavRaw>('/aficionados-equipos', dto);
    return normalizarFav(res);
  },

  async desvincularEquipoFavorito(aficionadoId: number, equipoId: number): Promise<void> {
    return sportsHttpClient.delete(`/aficionados-equipos/${aficionadoId}/${equipoId}`);
  },
};
