import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, Page } from '../../shared/pagination';
import { HabilidadJugador, HabilidadJugadorRaw, AsignarHabilidadDto } from '../domain/habilidadModels';

export function normalizarHabilidadJugador(raw: HabilidadJugadorRaw, jugadorIdFallback = 0): HabilidadJugador {
  const id_habilidad = Number(raw.habilidadId ?? raw.habilidad?.id ?? raw.habilidad?.id_habilidad ?? raw.id_habilidad ?? 0);
  const id_jugador = Number(raw.jugadorId ?? raw.jugador?.id ?? raw.jugador?.id_jugador ?? raw.id_jugador ?? jugadorIdFallback);
  const nombre = raw.habilidad?.nombre ?? raw.habilidadNombre;
  return {
    id_jugador,
    id_habilidad,
    nivel: raw.nivel ?? null,
    habilidad: nombre
      ? {
          id_habilidad,
          nombre,
          descripcion: raw.habilidad?.descripcion ?? raw.habilidadDescripcion,
        }
      : undefined,
  };
}

export const habilidadesService = {
  async getHabilidadesPorJugador(jugadorId: number): Promise<HabilidadJugador[]> {
    const res = await sportsHttpClient.get<HabilidadJugadorRaw[] | Page<HabilidadJugadorRaw>>(
      `/habilidades-jugador/${jugadorId}`
    );
    return asArray(res)
      .map((r) => normalizarHabilidadJugador(r, jugadorId))
      .filter((h) => h.id_habilidad > 0);
  },

  async asignarHabilidad(dto: AsignarHabilidadDto): Promise<HabilidadJugador> {
    const payload: AsignarHabilidadDto = { jugadorId: dto.jugadorId, habilidadId: dto.habilidadId };
    if (dto.nivel !== undefined) payload.nivel = dto.nivel;
    const res = await sportsHttpClient.post<HabilidadJugadorRaw>('/habilidades-jugador', payload);
    return normalizarHabilidadJugador(res ?? {}, dto.jugadorId);
  },

  async eliminarHabilidad(jugadorId: number, habilidadId: number): Promise<void> {
    return sportsHttpClient.delete(`/habilidades-jugador/${jugadorId}/${habilidadId}`);
  },
};
