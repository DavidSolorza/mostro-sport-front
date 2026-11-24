import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, FIRST_PAGE, Page, SELECT_PAGE_SIZE } from '../../shared/pagination';
import {
  TorneoOption,
  FaseOption,
  EscenarioOption,
  EquipoOption,
  JugadorOption,
  PelotaOption,
  HabilidadOption,
  MetodoPagoCatalogoOption,
} from '../domain/stubModels';

// Antes consultaba /stubs/* (solo desarrollo, sin permisos). Ahora usa los endpoints reales
// y adapta la respuesta (camelCase, `id`) a las opciones que esperan los selects.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = Record<string, any>;

const listar = async (path: string, params: Record<string, string | number | boolean> = {}): Promise<Raw[]> => {
  const res = await sportsHttpClient.get<Raw[] | Page<Raw>>(
    `${path}${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE, ...params })}`
  );
  return asArray(res);
};

export const stubsService = {
  async getTorneos(): Promise<TorneoOption[]> {
    const rows = await listar('/torneos');
    return rows.map((t) => ({
      id_torneo: t.id,
      nombre: t.nombre,
      fecha_inicio: t.fechaInicio,
      fecha_fin: t.fechaFin,
    }));
  },

  async getFases(torneoId: number): Promise<FaseOption[]> {
    const res = await sportsHttpClient.get<Raw[] | Page<Raw>>(`/torneos/${torneoId}/fases`);
    return asArray(res).map((f) => ({
      id_fase: f.id,
      nombre: f.nombre,
      tipo: f.tipo,
      id_torneo: f.torneoId ?? torneoId,
    }));
  },

  async getEscenarios(): Promise<EscenarioOption[]> {
    const rows = await listar('/escenarios', { activo: true });
    return rows.map((e) => ({ id_escenario: e.id, nombre: e.nombre, direccion: e.direccion ?? undefined }));
  },

  async getEquipos(): Promise<EquipoOption[]> {
    const rows = await listar('/equipos', { activo: true });
    return rows.map((e) => ({ id_equipo: e.id, nombre: e.nombre }));
  },

  async getJugadores(): Promise<JugadorOption[]> {
    const rows = await listar('/jugadores', { activo: true });
    return rows.map((j) => ({
      id_jugador: j.id,
      nombre: j.nombre,
      apellido: j.apellido ?? undefined,
      id_posicion: j.posicionId ?? undefined,
    }));
  },

  async getPelotas(): Promise<PelotaOption[]> {
    const res = await sportsHttpClient.get<Raw[] | Page<Raw>>('/pelotas');
    return asArray(res).map((p) => ({
      id_pelota: p.id,
      referencia: p.referencia ?? p.nombre ?? `Pelota ${p.id}`,
      marca: p.marca ?? undefined,
    }));
  },

  async getHabilidades(): Promise<HabilidadOption[]> {
    const res = await sportsHttpClient.get<Raw[] | Page<Raw>>('/habilidades');
    return asArray(res).map((h) => ({
      id_habilidad: h.id,
      nombre: h.nombre,
      descripcion: h.descripcion ?? undefined,
    }));
  },

  async getMetodosPago(): Promise<MetodoPagoCatalogoOption[]> {
    const res = await sportsHttpClient.get<Raw[] | Page<Raw>>('/metodos-pago');
    return asArray(res).map((m) => ({ id_metodo_pago: m.id, nombre: m.nombre }));
  },
};
