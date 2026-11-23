import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { DesarrolloTorneo, PosicionEquipo } from '../domain/desarrolloModels';

export const desarrolloService = {
  async getDesarrolloTorneo(torneoId: number): Promise<DesarrolloTorneo> {
    return sportsHttpClient.get<DesarrolloTorneo>(`/torneos-desarrollo/${torneoId}/desarrollo`);
  },

  async getTablaPosiciones(torneoId: number): Promise<PosicionEquipo[]> {
    return sportsHttpClient.get<PosicionEquipo[]>(`/torneos-desarrollo/${torneoId}/tabla-posiciones`);
  },
};
