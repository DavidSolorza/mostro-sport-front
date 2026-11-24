import { fromJoin } from '../../shared/joinRows';
import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, FIRST_PAGE, Page, PageQuery, SELECT_PAGE_SIZE } from '../../shared/pagination';
import { Deporte } from '../../deportes/domain/deporteModels';
import {
  ActualizarVinculoDto,
  AsociarJugadorDto,
  CreateEquipoDto,
  Equipo,
  EquipoFiltros,
  EquipoJugador,
  UpdateEquipoDto,
} from '../domain/equipoModels';

export const equiposService = {
  listar(filtros: EquipoFiltros, q: PageQuery): Promise<Page<Equipo>> {
    return sportsHttpClient.get<Page<Equipo>>(`/equipos${buildQuery({ ...filtros, ...q })}`);
  },

  async listarActivos(): Promise<Equipo[]> {
    const res = await sportsHttpClient.get<Page<Equipo> | Equipo[]>(
      `/equipos${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE, activo: true })}`
    );
    return asArray(res);
  },

  obtener(id: number): Promise<Equipo> {
    return sportsHttpClient.get<Equipo>(`/equipos/${id}`);
  },

  crear(dto: CreateEquipoDto): Promise<Equipo> {
    return sportsHttpClient.post<Equipo>('/equipos', dto);
  },

  actualizar(id: number, dto: UpdateEquipoDto): Promise<Equipo> {
    return sportsHttpClient.put<Equipo>(`/equipos/${id}`, dto);
  },

  cambiarEstado(id: number, activo: boolean): Promise<Equipo> {
    return sportsHttpClient.patch<Equipo>(`/equipos/${id}/estado`, { activo });
  },

  eliminar(id: number): Promise<void> {
    return sportsHttpClient.delete(`/equipos/${id}`);
  },

  // Equipo-Deporte (HU-GD-03)
  async deportesDeEquipo(equipoId: number): Promise<Deporte[]> {
    return fromJoin<Deporte>(asArray(await sportsHttpClient.get<unknown[] | Page<unknown>>(`/equipos/${equipoId}/deportes`)), 'deporte');
  },

  asociarDeporte(equipoId: number, deporteId: number): Promise<void> {
    return sportsHttpClient.post(`/equipos/${equipoId}/deportes/${deporteId}`);
  },

  quitarDeporte(equipoId: number, deporteId: number): Promise<void> {
    return sportsHttpClient.delete(`/equipos/${equipoId}/deportes/${deporteId}`);
  },

  // Equipo-Jugador (HU-GD-05)
  async jugadoresDeEquipo(equipoId: number, vigentes?: boolean): Promise<EquipoJugador[]> {
    const res = await sportsHttpClient.get<EquipoJugador[] | Page<EquipoJugador>>(
      `/equipos/${equipoId}/jugadores${buildQuery({ vigentes })}`
    );
    return asArray(res);
  },

  asociarJugador(equipoId: number, dto: AsociarJugadorDto): Promise<EquipoJugador> {
    return sportsHttpClient.post<EquipoJugador>(`/equipos/${equipoId}/jugadores`, dto);
  },

  actualizarVinculo(equipoId: number, jugadorId: number, dto: ActualizarVinculoDto): Promise<EquipoJugador> {
    return sportsHttpClient.put<EquipoJugador>(`/equipos/${equipoId}/jugadores/${jugadorId}`, dto);
  },

  retirarJugador(equipoId: number, jugadorId: number): Promise<void> {
    return sportsHttpClient.delete(`/equipos/${equipoId}/jugadores/${jugadorId}`);
  },
};
