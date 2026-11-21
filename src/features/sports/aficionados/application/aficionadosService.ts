import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { Aficionado, MetodoPagoAficionado, AficionadoEquipo } from '../domain/aficionadoModels';

export const aficionadosService = {
  async getAficionadoByUsuarioId(usuarioId: number): Promise<Aficionado> {
    return sportsHttpClient.get<Aficionado>(`/aficionados/usuario/${usuarioId}`);
  },

  async registrarAficionado(dto: { usuario_id: number; nombre: string; apellido?: string; telefono?: string }): Promise<Aficionado> {
    return sportsHttpClient.post<Aficionado>('/aficionados', dto);
  },

  async getMetodosPago(aficionadoId: number): Promise<MetodoPagoAficionado[]> {
    return sportsHttpClient.get<MetodoPagoAficionado[]>(`/metodos-pago-aficionado/${aficionadoId}`);
  },

  async asociarMetodoPago(dto: { id_aficionado: number; id_metodo_pago: number; referencia: string }): Promise<MetodoPagoAficionado> {
    return sportsHttpClient.post<MetodoPagoAficionado>('/metodos-pago-aficionado', dto);
  },

  async eliminarMetodoPago(id: number): Promise<void> {
    return sportsHttpClient.delete(`/metodos-pago-aficionado/${id}`);
  },

  async getEquiposFavoritos(aficionadoId: number): Promise<AficionadoEquipo[]> {
    return sportsHttpClient.get<AficionadoEquipo[]>(`/aficionados-equipos/${aficionadoId}`);
  },

  async vincularEquipoFavorito(dto: { id_aficionado: number; id_equipo: number }): Promise<AficionadoEquipo> {
    return sportsHttpClient.post<AficionadoEquipo>('/aficionados-equipos', dto);
  },

  async desvincularEquipoFavorito(aficionadoId: number, equipoId: number): Promise<void> {
    return sportsHttpClient.delete(`/aficionados-equipos/${aficionadoId}/${equipoId}`);
  },
};
