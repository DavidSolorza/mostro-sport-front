import { describe, it, expect } from 'vitest';
import { pizarraService } from './pizarraService';
import { Partido } from '../../partidos/domain/partidoModels';

const partido = (anotaciones: number): Partido =>
  ({
    id_partido: 7,
    estado: 'EN_CURSO',
    anotaciones: Array.from({ length: anotaciones }, (_, i) => ({ id_anotacion: i, id_jugador: 9 })),
  }) as unknown as Partido;

describe('pizarraService.generarAlineacionDefault', () => {
  it('el marcador simulado inicia 0-0 y los goles oficiales se muestran aparte', () => {
    const e = pizarraService.generarAlineacionDefault(partido(3));
    expect(e.marcadorLocal).toBe(0);
    expect(e.marcadorVisitante).toBe(0);
    expect(e.golesOficiales).toBe(3);
    expect(e.partidoId).toBe(7);
  });

  it('partido sin anotaciones => 0 goles oficiales y minuto >= 1', () => {
    const e = pizarraService.generarAlineacionDefault({ id_partido: 1, estado: 'PROGRAMADO' } as Partido);
    expect(e.golesOficiales).toBe(0);
    expect(e.minutoActual).toBeGreaterThanOrEqual(1);
  });

  it('el minuto nunca supera 90', () => {
    expect(pizarraService.generarAlineacionDefault(partido(20)).minutoActual).toBeLessThanOrEqual(90);
  });
});
