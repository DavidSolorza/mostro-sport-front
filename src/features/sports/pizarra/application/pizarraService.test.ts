import { describe, it, expect } from 'vitest';
import { deApiAPorcentaje, dePorcentajeAApi, pizarraService } from './pizarraService';
import { Partido } from '../../partidos/domain/partidoModels';

const partido = (anotaciones: number): Partido =>
  ({
    id_partido: 7,
    estado: 'EN_CURSO',
    anotaciones: Array.from({ length: anotaciones }, (_, i) => ({ id_anotacion: i, id_jugador: 9 })),
  }) as unknown as Partido;

describe('pizarraService', () => {
  it('escala coordenadas normalizadas (0..1) a porcentaje (4..96)', () => {
    expect(deApiAPorcentaje(0.5)).toBe(50);
    expect(deApiAPorcentaje(0)).toBe(4);
    expect(deApiAPorcentaje(1)).toBe(96);
    expect(dePorcentajeAApi(50)).toBe(0.5);
  });

  it('el marcador simulado inicia 0-0 y los goles oficiales se muestran aparte', () => {
    const e = pizarraService.generarAlineacionDefault(partido(3));
    expect(e.marcadorLocal).toBe(0);
    expect(e.marcadorVisitante).toBe(0);
    expect(e.golesOficiales).toBe(3);
    expect(e.partidoId).toBe(7);
  });

  it('partido FINALIZADO pone periodo FIN y minuto <= 90', () => {
    const fin = pizarraService.generarAlineacionDefault({ id_partido: 1, estado: 'FINALIZADO' } as Partido);
    expect(fin.periodo).toBe('FIN');
    expect(pizarraService.generarAlineacionDefault(partido(20)).minutoActual).toBeLessThanOrEqual(90);
  });
});
