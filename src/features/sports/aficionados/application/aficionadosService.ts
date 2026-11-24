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

export interface MetodoPagoCatalogo {
  id: number;
  nombre: string;
  descripcion?: string;
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

export const aficionadosService = {
  async getAficionadoByUsuarioId(usuarioId: number): Promise<Aficionado> {
    return sportsHttpClient.get<Aficionado>(`/aficionados/usuario/${usuarioId}`);
  },
  async registrarAficionado(dto: { usuarioId: number; nombre: string; apellido?: string; telefono?: string }): Promise<Aficionado> {
    return sportsHttpClient.post<Aficionado>('/aficionados', dto);
  },
  async getCatalogoMetodosPago(): Promise<MetodoPagoCatalogo[]> {
    const res = await sportsHttpClient.get<MetodoPagoCatalogo[] | { content: MetodoPagoCatalogo[] }>('/metodos-pago');
    return Array.isArray(res) ? res : (res.content ?? []);
  },
  async getMetodosPago(aficionadoId: number): Promise<MetodoPagoAficionado[]> {
    const res = await sportsHttpClient.get<MetodoRaw[]>(`/aficionados/${aficionadoId}/metodos-pago`);
    return (res ?? []).map(normalizarMetodo);
  },
  async asociarMetodoPago(aficionadoId: number, dto: { metodoPagoId: number; referencia: string }): Promise<MetodoPagoAficionado> {
    const res = await sportsHttpClient.post<MetodoRaw>(`/aficionados/${aficionadoId}/metodos-pago`, dto);
    return normalizarMetodo(res);
  },
  async actualizarMetodoPago(aficionadoId: number, mpId: number, dto: { metodoPagoId: number; referencia: string }): Promise<MetodoPagoAficionado> {
    const res = await sportsHttpClient.put<MetodoRaw>(`/aficionados/${aficionadoId}/metodos-pago/${mpId}`, dto);
    return normalizarMetodo(res);
  },
  async eliminarMetodoPago(aficionadoId: number, mpId: number): Promise<void> {
    return sportsHttpClient.delete(`/aficionados/${aficionadoId}/metodos-pago/${mpId}`);
  },
  async getEquiposFavoritos(aficionadoId: number): Promise<AficionadoEquipo[]> {
    const res = await sportsHttpClient.get<EquipoFavRaw[]>(`/aficionados-equipos/${aficionadoId}`);
    return (res ?? []).map((r) => ({
      id_aficionado: Number(r.id_aficionado ?? r.aficionadoId ?? 0),
      id_equipo: Number(r.id_equipo ?? r.equipoId ?? 0),
      equipo: r.equipo ?? { id_equipo: Number(r.id_equipo ?? r.equipoId ?? 0), nombre: r.equipoNombre || `Equipo #${r.equipoId ?? r.id_equipo}` },
    }));
  },
  async vincularEquipoFavorito(dto: { id_aficionado: number; id_equipo: number }): Promise<AficionadoEquipo> {
    const res = await sportsHttpClient.post<EquipoFavRaw>('/aficionados-equipos', dto);
    return { id_aficionado: Number(res.id_aficionado ?? res.aficionadoId ?? dto.id_aficionado), id_equipo: Number(res.id_equipo ?? res.equipoId ?? dto.id_equipo), equipo: res.equipo };
  },
  async desvincularEquipoFavorito(aficionadoId: number, equipoId: number): Promise<void> {
    return sportsHttpClient.delete(`/aficionados/${aficionadoId}/equipos/${equipoId}`);
  },
};
