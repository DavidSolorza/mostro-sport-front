import { describe, it, expect, vi } from 'vitest';
import { simuladorJugadasService as sim } from './simuladorJugadasService';

describe('simuladorJugadasService', () => {
  it('estado inicial: 10 jugadores, marcador 0-0, posesión suma 100', () => {
    const e = sim.crearEstadoInicial(1);
    expect(e.jugadores).toHaveLength(10);
    expect(e.marcadorLocal + e.marcadorVisitante).toBe(0);
    expect(e.estadisticas.posesionLocal + e.estadisticas.posesionVisitante).toBe(100);
  });

  it('simularMovimiento mantiene balón y jugadores dentro del campo (200 ticks)', () => {
    let e = sim.crearEstadoInicial(1);
    for (let i = 0; i < 200; i++) e = sim.simularMovimiento(e);
    expect(e.balon.x).toBeGreaterThanOrEqual(0);
    expect(e.balon.x).toBeLessThanOrEqual(100);
    for (const j of e.jugadores) {
      expect(j.x).toBeGreaterThanOrEqual(0);
      expect(j.x).toBeLessThanOrEqual(100);
      expect(j.y).toBeGreaterThanOrEqual(0);
      expect(j.y).toBeLessThanOrEqual(100);
    }
    expect(e.estadisticas.posesionLocal + e.estadisticas.posesionVisitante).toBe(100);
  });

  it('el cronómetro avanza y cambia de periodo', () => {
    let e = { ...sim.crearEstadoInicial(1), minutoActual: 44, segundoActual: 58 };
    e = sim.simularMovimiento(e);
    expect(e.periodo).toBe('2T');
    e = { ...e, minutoActual: 89, segundoActual: 58 };
    e = sim.simularMovimiento(e);
    expect(e.periodo).toBe('FIN');
  });

  it('remate con gol suma al marcador del atacante y registra evento GOL', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const { estado, esGol } = sim.dispararRemate(sim.crearEstadoInicial(1), 'LOCAL');
    expect(esGol).toBe(true);
    expect(estado.marcadorLocal).toBe(1);
    expect(estado.marcadorVisitante).toBe(0);
    expect(estado.eventos[0].tipo).toBe('GOL');
    vi.restoreAllMocks();
  });

  it('remate fallado no cambia el marcador pero cuenta como tiro', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const base = sim.crearEstadoInicial(1);
    const { estado, esGol } = sim.dispararRemate(base, 'VISITANTE');
    expect(esGol).toBe(false);
    expect(estado.marcadorVisitante).toBe(0);
    expect(estado.estadisticas.tirosVisitante).toBe(base.estadisticas.tirosVisitante + 1);
    vi.restoreAllMocks();
  });

  it('el feed de eventos está acotado a 16 elementos', () => {
    let e = sim.crearEstadoInicial(1);
    for (let i = 0; i < 40; i++) e = sim.dispararRemate(e, 'LOCAL').estado;
    expect(e.eventos.length).toBeLessThanOrEqual(16);
  });
});
