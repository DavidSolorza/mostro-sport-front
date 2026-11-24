import { describe, it, expect } from 'vitest';
import { normalizarPartido } from './partidosService';
import { normalizarApuesta } from '../../apuestas/application/apuestasService';

describe('Normalización de respuestas camelCase del backend', () => {
  it('normalizarPartido mapea id -> id_partido y arma partidoEquipos (evita 404 en cuota)', () => {
    const p = normalizarPartido({
      id: 12,
      fechaHora: '2026-12-01T20:00:00.000Z',
      estado: 'PROGRAMADO',
      torneoId: 1,
      torneoNombre: 'Liga',
      escenarioId: 2,
      equipoLocalId: 10,
      equipoLocalNombre: 'Nacional',
      equipoVisitanteId: 11,
      equipoVisitanteNombre: 'Millonarios',
    });
    expect(p.id_partido).toBe(12);
    expect(p.partidoEquipos).toHaveLength(2);
    expect(p.partidoEquipos?.[0]).toMatchObject({ rol: 'LOCAL', id_equipo: 10 });
    expect(p.partidoEquipos?.[1]).toMatchObject({ rol: 'VISITANTE', id_equipo: 11 });
  });

  it('normalizarApuesta mapea id -> id_apuesta y aficionadoNombre', () => {
    const a = normalizarApuesta({
      id: 45,
      monto: 100,
      fechaHora: '2026-12-01T18:00:00.000Z',
      estado: 'REGISTRADA',
      aficionadoId: 1,
      aficionadoNombre: 'David',
      partidoId: 12,
      metodoAficionadoId: 3,
      equipoId: 10,
    });
    expect(a.id_apuesta).toBe(45);
    expect(a.id_partido).toBe(12);
    expect(a.id_equipo_seleccionado).toBe(10);
    expect(a.aficionado?.nombre).toBe('David');
  });
});
