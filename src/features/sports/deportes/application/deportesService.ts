import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, Page, SELECT_PAGE_SIZE, FIRST_PAGE } from '../../shared/pagination';
import { Deporte } from '../domain/deporteModels';
import { Equipo } from '../../equipos/domain/equipoModels';

/** Solo lectura: Deporte es entidad solo-API (sin interfaz); se consulta para selects. */
export const deportesService = {
  async listarActivos(): Promise<Deporte[]> {
    const res = await sportsHttpClient.get<Page<Deporte> | Deporte[]>(
      `/deportes${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE, activo: true })}`
    );
    return asArray(res);
  },

  async equiposDeDeporte(deporteId: number): Promise<Equipo[]> {
    const res = await sportsHttpClient.get<Equipo[] | Page<Equipo>>(`/deportes/${deporteId}/equipos`);
    return asArray(res);
  },
};
