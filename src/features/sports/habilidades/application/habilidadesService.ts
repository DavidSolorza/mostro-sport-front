import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { HabilidadJugador, AsignarHabilidadDto } from '../domain/habilidadModels';

export const habilidadesService = {
  async getHabilidadesPorJugador(jugadorId: number): Promise<HabilidadJugador[]> {
    return sportsHttpClient.get<HabilidadJugador[]>(`/habilidades-jugador/${jugadorId}`);
  },

  async asignarHabilidad(dto: AsignarHabilidadDto): Promise<HabilidadJugador> {
    return sportsHttpClient.post<HabilidadJugador>('/habilidades-jugador', dto);
  },

  async eliminarHabilidad(jugadorId: number, habilidadId: number): Promise<void> {
    return sportsHttpClient.delete(`/habilidades-jugador/${jugadorId}/${habilidadId}`);
  },
};
