import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, FIRST_PAGE, Page, PageQuery, SELECT_PAGE_SIZE } from '../../shared/pagination';
import {
  CreateEscenarioDto,
  CreateSubescenarioDto,
  Escenario,
  EscenarioFiltros,
  UpdateEscenarioDto,
} from '../domain/escenarioModels';

export const escenariosService = {
  listar(filtros: EscenarioFiltros, q: PageQuery): Promise<Page<Escenario>> {
    return sportsHttpClient.get<Page<Escenario>>(`/escenarios${buildQuery({ ...filtros, ...q })}`);
  },

  async listarActivos(): Promise<Escenario[]> {
    const res = await sportsHttpClient.get<Page<Escenario> | Escenario[]>(
      `/escenarios${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE, activo: true })}`
    );
    return asArray(res);
  },

  obtener(id: number): Promise<Escenario> {
    return sportsHttpClient.get<Escenario>(`/escenarios/${id}`);
  },

  crear(dto: CreateEscenarioDto): Promise<Escenario> {
    return sportsHttpClient.post<Escenario>('/escenarios', dto);
  },

  actualizar(id: number, dto: UpdateEscenarioDto): Promise<Escenario> {
    return sportsHttpClient.put<Escenario>(`/escenarios/${id}`, dto);
  },

  cambiarEstado(id: number, activo: boolean): Promise<Escenario> {
    return sportsHttpClient.patch<Escenario>(`/escenarios/${id}/estado`, { activo });
  },

  eliminar(id: number): Promise<void> {
    return sportsHttpClient.delete(`/escenarios/${id}`);
  },

  async subescenarios(id: number): Promise<Escenario[]> {
    const res = await sportsHttpClient.get<Page<Escenario> | Escenario[]>(
      `/escenarios/${id}/subescenarios${buildQuery({ page: FIRST_PAGE, size: SELECT_PAGE_SIZE })}`
    );
    return asArray(res);
  },

  crearSubescenario(id: number, dto: CreateSubescenarioDto): Promise<Escenario> {
    return sportsHttpClient.post<Escenario>(`/escenarios/${id}/subescenarios`, dto);
  },
};
