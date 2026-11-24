import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { DesarrolloTorneo, FaseDesarrollo, PosicionEquipo } from '../domain/desarrolloModels';

const num = (v: unknown): number => Number(v ?? 0);
const list = <T>(v: unknown): T[] => {
  if (Array.isArray(v)) return v as T[];
  const content = (v as { content?: unknown } | null)?.content;
  return Array.isArray(content) ? (content as T[]) : [];
};

export const desarrolloService = {
  async getDesarrolloTorneo(torneoId: number): Promise<DesarrolloTorneo> {
    const raw = await sportsHttpClient.get<DesarrolloTorneo>(`/torneos-desarrollo/${torneoId}/desarrollo`);
    return {
      ...raw,
      torneoId: num(raw.torneoId),
      fases: list<FaseDesarrollo>(raw.fases).map((f) => ({
        ...f,
        faseId: num(f.faseId),
        orden: num(f.orden),
        partidosConResultado: list(f.partidosConResultado),
        partidosPendientes: list(f.partidosPendientes),
      })),
    };
  },

  async getTablaPosiciones(torneoId: number): Promise<PosicionEquipo[]> {
    const raw = await sportsHttpClient.get<unknown>(`/torneos-desarrollo/${torneoId}/tabla-posiciones`);
    return list<PosicionEquipo>(raw).map((p) => ({
      ...p,
      equipoId: num(p.equipoId),
      pj: num(p.pj),
      pg: num(p.pg),
      pe: num(p.pe),
      pp: num(p.pp),
      gf: num(p.gf),
      gc: num(p.gc),
      dg: num(p.dg),
      puntos: num(p.puntos),
    }));
  },
};
