import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import {
  asArray,
  buildQuery,
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  Page,
  SELECT_PAGE_SIZE,
} from '../../shared/pagination';
import { Apuesta, CreateApuestaDto } from '../domain/apuestaModels';

export const apuestasService = {
  async getApuestasPage(params: {
    aficionadoId?: number;
    partidoId?: number;
    page?: number;
    size?: number;
  } = {}): Promise<Page<Apuesta>> {
    const qs = buildQuery({
      aficionadoId: params.aficionadoId,
      partidoId: params.partidoId,
      page: params.page ?? FIRST_PAGE,
      size: params.size ?? DEFAULT_PAGE_SIZE,
    });
    const res = await sportsHttpClient.get<Page<Apuesta> | Apuesta[]>(`/apuestas${qs}`);
    if (Array.isArray(res)) return { content: res, totalElements: res.length };
    return { content: res?.content ?? [], totalElements: res?.totalElements ?? 0 };
  },

  async getApuestas(aficionadoId?: number, partidoId?: number): Promise<Apuesta[]> {
    const page = await this.getApuestasPage({ aficionadoId, partidoId, page: FIRST_PAGE, size: SELECT_PAGE_SIZE });
    return asArray(page);
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
    return sportsHttpClient.post<Apuesta>(`/apuestas/${id}/cancelar`);
  },

  async getCuotaPartido(partidoId: number): Promise<{ cuota: number }> {
    return sportsHttpClient.get<{ cuota: number }>(`/apuestas/partido/${partidoId}/cuota`);
  },
};
