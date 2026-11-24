import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import {
  asArray,
  buildQuery,
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  Page,
  SELECT_PAGE_SIZE,
} from '../../shared/pagination';
import { Apuesta, CreateApuestaDto, EstadoApuesta } from '../domain/apuestaModels';

interface ApuestaRaw extends Partial<Apuesta> {
  id?: number;
  fechaHora?: string;
  aficionadoId?: number;
  aficionadoNombre?: string;
  partidoId?: number;
  metodoAficionadoId?: number;
  equipoId?: number;
}

export function normalizarApuesta(raw: ApuestaRaw): Apuesta {
  const id_aficionado = Number(raw.id_aficionado ?? raw.aficionadoId ?? 0);
  return {
    id_apuesta: Number(raw.id_apuesta ?? raw.id ?? 0),
    monto: Number(raw.monto ?? 0),
    fecha_hora: raw.fecha_hora ?? raw.fechaHora ?? '',
    estado: (raw.estado ?? 'REGISTRADA') as EstadoApuesta,
    id_aficionado,
    id_partido: Number(raw.id_partido ?? raw.partidoId ?? 0),
    id_metodo_aficionado: raw.id_metodo_aficionado ?? raw.metodoAficionadoId ?? null,
    id_equipo_seleccionado: raw.id_equipo_seleccionado ?? raw.equipoId ?? null,
    equipoId: raw.equipoId ?? null,
    partido: raw.partido,
    aficionado: raw.aficionado ?? (raw.aficionadoNombre ? { id_aficionado, nombre: raw.aficionadoNombre } : undefined),
  };
}

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
    const res = await sportsHttpClient.get<Page<ApuestaRaw> | ApuestaRaw[]>(`/apuestas${qs}`);
    if (Array.isArray(res)) return { content: res.map(normalizarApuesta), totalElements: res.length };
    return { content: (res?.content ?? []).map(normalizarApuesta), totalElements: res?.totalElements ?? 0 };
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
    return normalizarApuesta(await sportsHttpClient.post<ApuestaRaw>('/apuestas', payload));
  },

  async cancelarApuesta(id: number): Promise<Apuesta> {
    return normalizarApuesta(await sportsHttpClient.post<ApuestaRaw>(`/apuestas/${id}/cancelar`));
  },

  async getCuotaPartido(partidoId: number): Promise<{ cuota: number }> {
    return sportsHttpClient.get<{ cuota: number }>(`/apuestas/partido/${partidoId}/cuota`);
  },
};
