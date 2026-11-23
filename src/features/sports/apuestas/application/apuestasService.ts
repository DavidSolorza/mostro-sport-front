import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { Apuesta, CreateApuestaDto } from '../domain/apuestaModels';

export const apuestasService = {
  async getApuestas(aficionadoId?: number, partidoId?: number): Promise<Apuesta[]> {
    const params = new URLSearchParams();
    if (aficionadoId) params.append('aficionadoId', String(aficionadoId));
    if (partidoId) params.append('partidoId', String(partidoId));
    const query = params.toString() ? `?${params.toString()}` : '';
    return sportsHttpClient.get<Apuesta[]>(`/apuestas${query}`);
  },

  async crearApuesta(dto: CreateApuestaDto): Promise<Apuesta> {
    return sportsHttpClient.post<Apuesta>('/apuestas', dto);
  },

  async cancelarApuesta(id: number): Promise<Apuesta> {
    return sportsHttpClient.patch<Apuesta>(`/apuestas/${id}/cancelar`);
  },

  async getCuotaPartido(partidoId: number): Promise<{ cuota: number }> {
    return sportsHttpClient.get<{ cuota: number }>(`/apuestas/partido/${partidoId}/cuota`);
  },
};
