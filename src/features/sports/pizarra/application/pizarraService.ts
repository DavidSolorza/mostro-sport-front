import { JugadorTactico, PizarraEstado } from '../domain/pizarraModels';
import { Partido } from '../../partidos/domain/partidoModels';

export const pizarraService = {
  generarAlineacionDefault(partido: Partido): PizarraEstado {
    const jugadores: JugadorTactico[] = [
      // Equipo Local (mitad izquierda)
      { id: 1, nombre: 'Portero Local', equipo: 'LOCAL', x: 8, y: 50, posicion: 'POR' },
      { id: 2, nombre: 'Defensa 1', equipo: 'LOCAL', x: 22, y: 25, posicion: 'DEF' },
      { id: 3, nombre: 'Defensa 2', equipo: 'LOCAL', x: 22, y: 75, posicion: 'DEF' },
      { id: 4, nombre: 'Medio', equipo: 'LOCAL', x: 35, y: 50, posicion: 'MED' },
      { id: 5, nombre: 'Delantero', equipo: 'LOCAL', x: 45, y: 50, posicion: 'DEL' },

      // Equipo Visitante (mitad derecha)
      { id: 6, nombre: 'Delantero Vis', equipo: 'VISITANTE', x: 55, y: 50, posicion: 'DEL' },
      { id: 7, nombre: 'Medio Vis', equipo: 'VISITANTE', x: 65, y: 50, posicion: 'MED' },
      { id: 8, nombre: 'Defensa Vis 1', equipo: 'VISITANTE', x: 78, y: 25, posicion: 'DEF' },
      { id: 9, nombre: 'Defensa Vis 2', equipo: 'VISITANTE', x: 78, y: 75, posicion: 'DEF' },
      { id: 10, nombre: 'Portero Vis', equipo: 'VISITANTE', x: 92, y: 50, posicion: 'POR' },
    ];

    return {
      partidoId: partido.id_partido,
      minutoActual: Math.min(90, Math.max(1, (partido.anotaciones?.length || 0) * 15)),
      balon: { x: 50, y: 50 },
      jugadores,
    };
  },
};
