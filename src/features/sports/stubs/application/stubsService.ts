import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
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

export const stubsService = {
  async getTorneos(): Promise<TorneoOption[]> {
    return sportsHttpClient.get<TorneoOption[]>('/stubs/torneos');
  },

  async getFases(torneoId: number): Promise<FaseOption[]> {
    return sportsHttpClient.get<FaseOption[]>(`/stubs/fases/${torneoId}`);
  },

  async getEscenarios(): Promise<EscenarioOption[]> {
    return sportsHttpClient.get<EscenarioOption[]>('/stubs/escenarios');
  },

  async getEquipos(): Promise<EquipoOption[]> {
    return sportsHttpClient.get<EquipoOption[]>('/stubs/equipos');
  },

  async getJugadores(): Promise<JugadorOption[]> {
    return sportsHttpClient.get<JugadorOption[]>('/stubs/jugadores');
  },

  async getPelotas(): Promise<PelotaOption[]> {
    return sportsHttpClient.get<PelotaOption[]>('/stubs/pelotas');
  },

  async getHabilidades(): Promise<HabilidadOption[]> {
    return sportsHttpClient.get<HabilidadOption[]>('/stubs/habilidades');
  },

  async getMetodosPago(): Promise<MetodoPagoCatalogoOption[]> {
    return sportsHttpClient.get<MetodoPagoCatalogoOption[]>('/stubs/metodos-pago');
  },
};
