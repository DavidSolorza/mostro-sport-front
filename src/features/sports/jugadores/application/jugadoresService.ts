import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, FIRST_PAGE, Page, PageQuery, SELECT_PAGE_SIZE } from '../../shared/pagination';
import { EquipoJugador } from '../../equipos/domain/equipoModels';
import {
  CreateJugadorDto,
  Jugador,
  JugadorFiltros,
  JugadorPerfil,
  PosicionEspacialOption,
  UpdateJugadorDto,
} from '../domain/jugadorModels';

export const jugadoresService = {
  listar(filtros: JugadorFiltros, q: PageQuery): Promise<Page<Jugador>> {
    return sportsHttpClient.get<Page<Jugador>>(`/jugadores${buildQuery({ ...filtros, ...q })}`);
  },

  async listarActivos(): Promise<Jugador[]> {
    const res = await sportsHttpClient.get<Page<Jugador> | Jugador[]>(
      `/jugadores${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE, activo: true })}`
    );
    return asArray(res);
  },

  obtener(id: number): Promise<Jugador> {
    return sportsHttpClient.get<Jugador>(`/jugadores/${id}`);
  },

  perfil(id: number): Promise<JugadorPerfil> {
    return sportsHttpClient.get<JugadorPerfil>(`/jugadores/${id}/perfil`);
  },

  crear(dto: CreateJugadorDto): Promise<Jugador> {
    return sportsHttpClient.post<Jugador>('/jugadores', dto);
  },

  actualizar(id: number, dto: UpdateJugadorDto): Promise<Jugador> {
    return sportsHttpClient.put<Jugador>(`/jugadores/${id}`, dto);
  },

  cambiarEstado(id: number, activo: boolean): Promise<Jugador> {
    return sportsHttpClient.patch<Jugador>(`/jugadores/${id}/estado`, { activo });
  },

  eliminar(id: number): Promise<void> {
    return sportsHttpClient.delete(`/jugadores/${id}`);
  },

  async equiposDeJugador(id: number, vigentes?: boolean): Promise<EquipoJugador[]> {
    const res = await sportsHttpClient.get<EquipoJugador[] | Page<EquipoJugador>>(
      `/jugadores/${id}/equipos${buildQuery({ vigentes })}`
    );
    return asArray(res);
  },

  /** Solo lectura: Posicion Espacial es entidad solo-API. */
  async posiciones(): Promise<PosicionEspacialOption[]> {
    return asArray(await sportsHttpClient.get<PosicionEspacialOption[] | Page<PosicionEspacialOption>>('/posiciones-espaciales'));
  },
};
