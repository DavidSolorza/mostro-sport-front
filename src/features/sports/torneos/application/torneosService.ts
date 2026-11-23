import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, buildQuery, Page, PageQuery } from '../../shared/pagination';
import { Equipo } from '../../equipos/domain/equipoModels';
import { Escenario } from '../../escenarios/domain/escenarioModels';
import {
  CreateTorneoDto,
  EstadoTorneo,
  Fase,
  FaseFinal,
  Inscripcion,
  ModalidadFinal,
  Torneo,
  TorneoEstructura,
  TorneoFiltros,
  UpdateTorneoDto,
} from '../domain/torneoModels';

export const torneosService = {
  listar(filtros: TorneoFiltros, q: PageQuery): Promise<Page<Torneo>> {
    return sportsHttpClient.get<Page<Torneo>>(`/torneos${buildQuery({ ...filtros, ...q })}`);
  },

  obtener(id: number): Promise<Torneo> {
    return sportsHttpClient.get<Torneo>(`/torneos/${id}`);
  },

  estructura(id: number): Promise<TorneoEstructura> {
    return sportsHttpClient.get<TorneoEstructura>(`/torneos/${id}/estructura`);
  },

  crear(dto: CreateTorneoDto): Promise<Torneo> {
    return sportsHttpClient.post<Torneo>('/torneos', dto);
  },

  actualizar(id: number, dto: UpdateTorneoDto): Promise<Torneo> {
    return sportsHttpClient.put<Torneo>(`/torneos/${id}`, dto);
  },

  cambiarEstado(id: number, estado: EstadoTorneo): Promise<Torneo> {
    return sportsHttpClient.patch<Torneo>(`/torneos/${id}/estado`, { estado });
  },

  eliminar(id: number): Promise<void> {
    return sportsHttpClient.delete(`/torneos/${id}`);
  },

  // Inscripciones (HU-GC-08a)
  async inscripciones(torneoId: number): Promise<Inscripcion[]> {
    const res = await sportsHttpClient.get<Page<Inscripcion> | Inscripcion[]>(
      `/torneos/${torneoId}/inscripciones${buildQuery({ page: 1, size: 100 })}`
    );
    return asArray(res);
  },

  async equiposInscritos(torneoId: number): Promise<Equipo[]> {
    return asArray(await sportsHttpClient.get<Equipo[] | Page<Equipo>>(`/torneos/${torneoId}/equipos`));
  },

  async torneosDeEquipo(equipoId: number): Promise<Torneo[]> {
    return asArray(await sportsHttpClient.get<Torneo[] | Page<Torneo>>(`/equipos/${equipoId}/torneos`));
  },

  inscribir(torneoId: number, equipoId: number): Promise<Inscripcion> {
    return sportsHttpClient.post<Inscripcion>(`/torneos/${torneoId}/inscripciones`, { equipoId });
  },

  retirarInscripcion(torneoId: number, equipoId: number): Promise<void> {
    return sportsHttpClient.delete(`/torneos/${torneoId}/inscripciones/${equipoId}`);
  },

  // Fases: solo lectura (entidad sin interfaz)
  async fases(torneoId: number): Promise<Fase[]> {
    return asArray(await sportsHttpClient.get<Fase[] | Page<Fase>>(`/torneos/${torneoId}/fases`));
  },

  // Fase final (HU-GC-05)
  obtenerFaseFinal(torneoId: number): Promise<FaseFinal> {
    return sportsHttpClient.get<FaseFinal>(`/torneos/${torneoId}/fase-final`);
  },

  definirFaseFinal(torneoId: number, faseId: number, modalidad: ModalidadFinal): Promise<FaseFinal> {
    return sportsHttpClient.post<FaseFinal>(`/torneos/${torneoId}/fase-final`, { faseId, modalidad });
  },

  actualizarFaseFinal(torneoId: number, modalidad: ModalidadFinal): Promise<FaseFinal> {
    return sportsHttpClient.put<FaseFinal>(`/torneos/${torneoId}/fase-final`, { modalidad });
  },

  eliminarFaseFinal(torneoId: number): Promise<void> {
    return sportsHttpClient.delete(`/torneos/${torneoId}/fase-final`);
  },

  // Escenario-Torneo
  async escenariosDeTorneo(torneoId: number): Promise<Escenario[]> {
    return asArray(await sportsHttpClient.get<Escenario[] | Page<Escenario>>(`/torneos/${torneoId}/escenarios`));
  },

  asignarEscenario(torneoId: number, escenarioId: number): Promise<void> {
    return sportsHttpClient.post(`/torneos/${torneoId}/escenarios/${escenarioId}`);
  },

  quitarEscenario(torneoId: number, escenarioId: number): Promise<void> {
    return sportsHttpClient.delete(`/torneos/${torneoId}/escenarios/${escenarioId}`);
  },

  async torneosDeEscenario(escenarioId: number): Promise<Torneo[]> {
    return asArray(await sportsHttpClient.get<Torneo[] | Page<Torneo>>(`/escenarios/${escenarioId}/torneos`));
  },
};
