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
  PartidoEquipo,
} from '../domain/partidoModels';

interface PartidoRaw extends Partial<Partido> {
  id?: number;
  fechaHora?: string;
  torneoId?: number;
  torneoNombre?: string;
  faseId?: number;
  faseNombre?: string;
  escenarioId?: number;
  escenarioNombre?: string;
  equipoLocalId?: number;
  equipoLocalNombre?: string;
  equipoVisitanteId?: number;
  equipoVisitanteNombre?: string;
  pelotaId?: number;
}

export function normalizarPartido(raw: PartidoRaw): Partido {
  const id_partido = Number(raw.id_partido ?? raw.id ?? 0);
  let partidoEquipos: PartidoEquipo[] | undefined = raw.partidoEquipos;
  if (!partidoEquipos && (raw.equipoLocalId || raw.equipoVisitanteId)) {
    partidoEquipos = [];
    if (raw.equipoLocalId) {
      partidoEquipos.push({
        id_partido,
        id_equipo: Number(raw.equipoLocalId),
        rol: 'LOCAL',
        equipo: { id_equipo: Number(raw.equipoLocalId), nombre: raw.equipoLocalNombre || 'Local' },
      });
    }
    if (raw.equipoVisitanteId) {
      partidoEquipos.push({
        id_partido,
        id_equipo: Number(raw.equipoVisitanteId),
        rol: 'VISITANTE',
        equipo: { id_equipo: Number(raw.equipoVisitanteId), nombre: raw.equipoVisitanteNombre || 'Visitante' },
      });
    }
  }
  return {
    id_partido,
    fecha_hora: raw.fecha_hora ?? raw.fechaHora ?? '',
    estado: (raw.estado ?? 'PROGRAMADO') as Partido['estado'],
    id_torneo: Number(raw.id_torneo ?? raw.torneoId ?? 0),
    id_fase: raw.id_fase ?? raw.faseId ?? null,
    id_escenario: Number(raw.id_escenario ?? raw.escenarioId ?? 0),
    id_pelota: raw.id_pelota ?? raw.pelotaId ?? null,
    partidoEquipos,
    anotaciones: raw.anotaciones,
    escenario: raw.escenario ?? (raw.escenarioNombre ? { id_escenario: Number(raw.escenarioId ?? 0), nombre: raw.escenarioNombre } : undefined),
    torneo: raw.torneo ?? (raw.torneoNombre ? { id_torneo: Number(raw.torneoId ?? 0), nombre: raw.torneoNombre } : undefined),
    fase: raw.fase ?? (raw.faseNombre ? { id_fase: Number(raw.faseId ?? 0), nombre: raw.faseNombre } : undefined),
    pelota: raw.pelota,
  };
}

export const partidosService = {
  async getPartidosPage(params: { torneoId?: number; page?: number; size?: number } = {}): Promise<Page<Partido>> {
    const qs = buildQuery({
      torneoId: params.torneoId,
      page: params.page ?? FIRST_PAGE,
      size: params.size ?? DEFAULT_PAGE_SIZE,
    });
    const res = await sportsHttpClient.get<Page<PartidoRaw> | PartidoRaw[]>(`/partidos${qs}`);
    if (Array.isArray(res)) return { content: res.map(normalizarPartido), totalElements: res.length };
    return { content: (res?.content ?? []).map(normalizarPartido), totalElements: res?.totalElements ?? 0 };
  },

  async getPartidos(torneoId?: number): Promise<Partido[]> {
    const page = await this.getPartidosPage({ torneoId, page: FIRST_PAGE, size: SELECT_PAGE_SIZE });
    return asArray(page);
  },

  async getPartidoById(id: number): Promise<Partido> {
    return normalizarPartido(await sportsHttpClient.get<PartidoRaw>(`/partidos/${id}`));
  },

  async crearPartido(dto: CreatePartidoDto): Promise<Partido> {
    const payload = {
      ...dto,
      fechaHora: dto.fechaHora || dto.fecha_hora,
      torneoId: dto.torneoId ?? dto.id_torneo,
      faseId: dto.faseId ?? dto.id_fase,
      escenarioId: dto.escenarioId ?? dto.id_escenario,
      equipoLocalId: dto.equipoLocalId ?? dto.id_equipo_local,
      equipoVisitanteId: dto.equipoVisitanteId ?? dto.id_equipo_visitante,
      pelotaId: dto.pelotaId ?? dto.id_pelota,
    };
    return normalizarPartido(await sportsHttpClient.post<PartidoRaw>('/partidos', payload));
  },

  async cambiarEstado(id: number, estado: EstadoPartido): Promise<Partido> {
    return normalizarPartido(await sportsHttpClient.patch<PartidoRaw>(`/partidos/${id}/estado`, { estado }));
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
