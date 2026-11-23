import { PizarraEstado, JugadorTactico, EventoEnVivo } from '../domain/pizarraModels';

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const simuladorJugadasService = {
  crearEstadoInicial(partidoId: number): PizarraEstado {
    const jugadores: JugadorTactico[] = [
      { id: 1, dorsal: 1, nombre: 'Portero L.', equipo: 'LOCAL', x: 7, y: 50, posicion: 'POR' },
      { id: 2, dorsal: 4, nombre: 'Def. Central L.', equipo: 'LOCAL', x: 20, y: 35, posicion: 'DEF' },
      { id: 3, dorsal: 3, nombre: 'Def. Lateral L.', equipo: 'LOCAL', x: 20, y: 65, posicion: 'DEF' },
      { id: 4, dorsal: 8, nombre: 'Volante L.', equipo: 'LOCAL', x: 35, y: 50, posicion: 'MED' },
      { id: 5, dorsal: 9, nombre: 'Delantero L.', equipo: 'LOCAL', x: 46, y: 48, posicion: 'DEL' },
      { id: 6, dorsal: 9, nombre: 'Delantero V.', equipo: 'VISITANTE', x: 54, y: 52, posicion: 'DEL' },
      { id: 7, dorsal: 10, nombre: 'Volante V.', equipo: 'VISITANTE', x: 65, y: 50, posicion: 'MED' },
      { id: 8, dorsal: 2, nombre: 'Def. Central V.', equipo: 'VISITANTE', x: 80, y: 35, posicion: 'DEF' },
      { id: 9, dorsal: 5, nombre: 'Def. Lateral V.', equipo: 'VISITANTE', x: 80, y: 65, posicion: 'DEF' },
      { id: 10, dorsal: 1, nombre: 'Portero V.', equipo: 'VISITANTE', x: 93, y: 50, posicion: 'POR' },
    ];

    return {
      partidoId,
      minutoActual: 24,
      segundoActual: 15,
      periodo: '1T',
      marcadorLocal: 0,
      marcadorVisitante: 0,
      golesOficiales: 0,
      balon: { x: 50, y: 50 },
      jugadores,
      estadisticas: {
        posesionLocal: 52,
        posesionVisitante: 48,
        tirosLocal: 3,
        tirosVisitante: 2,
        tirosPuertaLocal: 1,
        tirosPuertaVisitante: 1,
        faltasLocal: 2,
        faltasVisitante: 3,
        cornersLocal: 1,
        cornersVisitante: 1,
      },
      eventos: [
        {
          id: 'ev-init',
          minuto: 1,
          segundo: 0,
          tipo: 'PASE',
          equipo: 'LOCAL',
          descripcion: 'Inicio del encuentro con silbatazo oficial.',
        },
      ],
    };
  },

  avanzarTiempo(prev: PizarraEstado): { minuto: number; segundo: number; periodo: '1T' | '2T' | 'FIN' } {
    let s = prev.segundoActual + 2;
    let m = prev.minutoActual;
    let p = prev.periodo;

    if (s >= 60) {
      s = 0;
      m += 1;
    }
    if (m >= 90) {
      p = 'FIN';
    } else if (m >= 45 && p === '1T') {
      p = '2T';
    }
    return { minuto: m, segundo: s, periodo: p };
  },

  simularMovimiento(prev: PizarraEstado): PizarraEstado {
    const tiempo = this.avanzarTiempo(prev);
    const balonBx = prev.balon.x + (Math.random() - 0.48) * 8;
    const balonBy = prev.balon.y + (Math.random() - 0.5) * 8;
    const balonX = clamp(balonBx, 10, 90);
    const balonY = clamp(balonBy, 12, 88);

    const jugadores = prev.jugadores.map((j) => {
      const haciaBalonX = (balonX - j.x) * 0.12;
      const haciaBalonY = (balonY - j.y) * 0.12;
      const ruidoX = (Math.random() - 0.5) * 4;
      const ruidoY = (Math.random() - 0.5) * 4;
      const minX = j.equipo === 'LOCAL' ? (j.posicion === 'POR' ? 4 : 12) : j.posicion === 'POR' ? 88 : 45;
      const maxX = j.equipo === 'LOCAL' ? (j.posicion === 'POR' ? 12 : 65) : j.posicion === 'POR' ? 96 : 88;
      return {
        ...j,
        x: clamp(j.x + haciaBalonX + ruidoX, minX, maxX),
        y: clamp(j.y + haciaBalonY + ruidoY, 10, 90),
      };
    });

    const posesion = clamp(Math.round(balonX < 50 ? 55 - (balonX / 50) * 10 : 45 + ((balonX - 50) / 50) * 10), 30, 70);

    return {
      ...prev,
      minutoActual: tiempo.minuto,
      segundoActual: tiempo.segundo,
      periodo: tiempo.periodo,
      balon: { x: balonX, y: balonY },
      jugadores,
      estadisticas: {
        ...prev.estadisticas,
        posesionLocal: posesion,
        posesionVisitante: 100 - posesion,
      },
    };
  },

  dispararRemate(prev: PizarraEstado, atacante: 'LOCAL' | 'VISITANTE'): { estado: PizarraEstado; esGol: boolean } {
    const esGol = Math.random() > 0.4;
    const xDestino = atacante === 'LOCAL' ? (esGol ? 96 : 94) : esGol ? 4 : 6;
    const yDestino = 50 + (Math.random() - 0.5) * (esGol ? 10 : 25);
    const nuevoMarcadorL = atacante === 'LOCAL' && esGol ? prev.marcadorLocal + 1 : prev.marcadorLocal;
    const nuevoMarcadorV = atacante === 'VISITANTE' && esGol ? prev.marcadorVisitante + 1 : prev.marcadorVisitante;

    const nuevoEvento: EventoEnVivo = {
      id: `ev-${Date.now()}`,
      minuto: prev.minutoActual,
      segundo: prev.segundoActual,
      tipo: esGol ? 'GOL' : 'TIRO',
      equipo: atacante,
      descripcion: esGol
        ? `¡GOOOOL! Anotación sensacional del equipo ${atacante}.`
        : `¡Remate peligroso del equipo ${atacante} que pasa rozando el poste!`,
    };

    return {
      esGol,
      estado: {
        ...prev,
        marcadorLocal: nuevoMarcadorL,
        marcadorVisitante: nuevoMarcadorV,
        balon: { x: xDestino, y: yDestino },
        estadisticas: {
          ...prev.estadisticas,
          tirosLocal: atacante === 'LOCAL' ? prev.estadisticas.tirosLocal + 1 : prev.estadisticas.tirosLocal,
          tirosVisitante: atacante === 'VISITANTE' ? prev.estadisticas.tirosVisitante + 1 : prev.estadisticas.tirosVisitante,
          tirosPuertaLocal: atacante === 'LOCAL' && esGol ? prev.estadisticas.tirosPuertaLocal + 1 : prev.estadisticas.tirosPuertaLocal,
          tirosPuertaVisitante: atacante === 'VISITANTE' && esGol ? prev.estadisticas.tirosPuertaVisitante + 1 : prev.estadisticas.tirosPuertaVisitante,
        },
        eventos: [nuevoEvento, ...prev.eventos.slice(0, 15)],
      },
    };
  },
};
