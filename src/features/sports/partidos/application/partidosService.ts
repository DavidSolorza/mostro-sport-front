import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import {
  asArray,
  buildQuery,
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  Page,
  SELECT_PAGE_SIZE,
} from '../../shared/pagination';
import {
  Partido,
  CreatePartidoDto,
  Anotacion,
  RegistrarAnotacionDto,
  FinalizarPartidoDto,
  EstadoPartido,
} from '../domain/partidoModels';

export const partidosService = {
  async getPartidosPage(params: { torneoId?: number; page?: number; size?: number } = {}): Promise<Page<Partido>> {
    const qs = buildQuery({
      torneoId: params.torneoId,
      page: params.page ?? FIRST_PAGE,
      size: params.size ?? DEFAULT_PAGE_SIZE,
    });
    const res = await sportsHttpClient.get<Page<Partido> | Partido[]>(`/partidos${qs}`);
    if (Array.isArray(res)) return { content: res, totalElements: res.length };
    return { content: res?.content ?? [], totalElements: res?.totalElements ?? 0 };
  },

  async getPartidos(torneoId?: number): Promise<Partido[]> {
    const page = await this.getPartidosPage({ torneoId, page: FIRST_PAGE, size: SELECT_PAGE_SIZE });
    return asArray(page);
  },

  async getPartidoById(id: number): Promise<Partido> {
    return sportsHttpClient.get<Partido>(`/partidos/${id}`);
  },

  async crearPartido(dto: CreatePartidoDto): Promise<Partido> {
    const payload = {
      ...dto,
      fechaHora: dto.fechaHora || dto.fecha_hora,
      fecha_hora: dto.fecha_hora || dto.fechaHora,
      torneoId: dto.torneoId ?? dto.id_torneo,
      id_torneo: dto.id_torneo ?? dto.torneoId,
      faseId: dto.faseId ?? dto.id_fase,
      id_fase: dto.id_fase ?? dto.faseId,
      escenarioId: dto.escenarioId ?? dto.id_escenario,
      id_escenario: dto.id_escenario ?? dto.escenarioId,
      equipoLocalId: dto.equipoLocalId ?? dto.id_equipo_local,
      id_equipo_local: dto.id_equipo_local ?? dto.equipoLocalId,
      equipoVisitanteId: dto.equipoVisitanteId ?? dto.id_equipo_visitante,
      id_equipo_visitante: dto.id_equipo_visitante ?? dto.equipoVisitanteId,
      pelotaId: dto.pelotaId ?? dto.id_pelota,
      id_pelota: dto.id_pelota ?? dto.pelotaId,
    };
    return sportsHttpClient.post<Partido>('/partidos', payload);
  },

  async cambiarEstado(id: number, estado: EstadoPartido): Promise<Partido> {
    return sportsHttpClient.patch<Partido>(`/partidos/${id}/estado`, { estado });
  },

  async registrarAnotacion(dto: RegistrarAnotacionDto): Promise<Anotacion> {
    return sportsHttpClient.post<Anotacion>('/anotaciones', dto);
  },

  async getAnotaciones(partidoId: number): Promise<Anotacion[]> {
    return sportsHttpClient.get<Anotacion[]>(`/partidos/${partidoId}/anotaciones`);
  },

  async finalizarPartido(id: number, dto: FinalizarPartidoDto): Promise<unknown> {
    return sportsHttpClient.put(`/partidos/${id}/resultado`, dto);
  },
};
