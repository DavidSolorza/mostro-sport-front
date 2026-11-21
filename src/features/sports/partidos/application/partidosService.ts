import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import {
  Partido,
  CreatePartidoDto,
  Anotacion,
  RegistrarAnotacionDto,
  FinalizarPartidoDto,
  EstadoPartido,
} from '../domain/partidoModels';

export const partidosService = {
  async getPartidos(torneoId?: number): Promise<Partido[]> {
    const query = torneoId ? `?torneoId=${torneoId}` : '';
    return sportsHttpClient.get<Partido[]>(`/partidos${query}`);
  },

  async getPartidoById(id: number): Promise<Partido> {
    return sportsHttpClient.get<Partido>(`/partidos/${id}`);
  },

  async crearPartido(dto: CreatePartidoDto): Promise<Partido> {
    return sportsHttpClient.post<Partido>('/partidos', dto);
  },

  async cambiarEstado(id: number, estado: EstadoPartido): Promise<Partido> {
    return sportsHttpClient.patch<Partido>(`/partidos/${id}/estado`, { estado });
  },

  async registrarAnotacion(dto: RegistrarAnotacionDto): Promise<Anotacion> {
    return sportsHttpClient.post<Anotacion>('/anotaciones', dto);
  },

  async getAnotaciones(partidoId: number): Promise<Anotacion[]> {
    return sportsHttpClient.get<Anotacion[]>(`/anotaciones/partido/${partidoId}`);
  },

  async finalizarPartido(id: number, dto: FinalizarPartidoDto): Promise<unknown> {
    return sportsHttpClient.post(`/partidos/${id}/finalizar`, dto);
  },
};
