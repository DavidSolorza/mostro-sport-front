import { PizarraEstado } from '../domain/pizarraModels';
import { Partido } from '../../partidos/domain/partidoModels';
import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { simuladorJugadasService } from './simuladorJugadasService';

export interface PosicionRemota {
  jugadorId?: number;
  esPelota?: boolean;
  x: number;
  y: number;
  timestamp: string;
}

export const pizarraService = {
  generarAlineacionDefault(partido: Partido): PizarraEstado {
    const estado = simuladorJugadasService.crearEstadoInicial(partido.id_partido);
    return {
      ...estado,
      partidoId: partido.id_partido,
      minutoActual: Math.min(90, Math.max(1, (partido.anotaciones?.length || 0) * 15)),
      // El marcador simulado inicia en 0-0; los goles oficiales se muestran por separado
      // (el backend no expone a qué equipo pertenece cada anotación).
      marcadorLocal: 0,
      marcadorVisitante: 0,
      golesOficiales: partido.anotaciones?.length || 0,
    };
  },

  async getUltimasPosiciones(partidoId: number): Promise<PosicionRemota[]> {
    return sportsHttpClient.get<PosicionRemota[]>(`/partidos/${partidoId}/posiciones/ultimas`);
  },

  async enviarLotePosiciones(partidoId: number, posiciones: Partial<PosicionRemota>[]): Promise<PosicionRemota[]> {
    return sportsHttpClient.post<PosicionRemota[]>(`/partidos/${partidoId}/posiciones`, { posiciones });
  },
};
