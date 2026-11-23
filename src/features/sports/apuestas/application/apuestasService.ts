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
    const payload = {
      ...dto,
      aficionadoId: dto.aficionadoId ?? dto.id_aficionado,
      id_aficionado: dto.id_aficionado ?? dto.aficionadoId,
      partidoId: dto.partidoId ?? dto.id_partido,
      id_partido: dto.id_partido ?? dto.partidoId,
      metodoAficionadoId: dto.metodoAficionadoId ?? dto.id_metodo_aficionado,
      id_metodo_aficionado: dto.id_metodo_aficionado ?? dto.metodoAficionadoId,
      equipoId: dto.equipoId ?? dto.id_equipo,
      id_equipo: dto.id_equipo ?? dto.equipoId,
    };
    return sportsHttpClient.post<Apuesta>('/apuestas', payload);
  },

  async cancelarApuesta(id: number): Promise<Apuesta> {
    return sportsHttpClient.patch<Apuesta>(`/apuestas/${id}/cancelar`);
  },

  async getCuotaPartido(partidoId: number): Promise<{ cuota: number }> {
    return sportsHttpClient.get<{ cuota: number }>(`/apuestas/partido/${partidoId}/cuota`);
  },
};
