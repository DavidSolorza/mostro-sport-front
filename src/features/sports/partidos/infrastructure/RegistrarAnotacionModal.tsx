import React, { useState, useEffect } from 'react';
import { Partido, RegistrarAnotacionDto } from '../domain/partidoModels';
import { stubsService } from '../../stubs/application/stubsService';
import { JugadorOption } from '../../stubs/domain/stubModels';
import { X, Trophy } from 'lucide-react';

interface Props {
  partido: Partido | null;
  onClose: () => void;
  onSubmit: (dto: RegistrarAnotacionDto) => Promise<void>;
}

export const RegistrarAnotacionModal: React.FC<Props> = ({ partido, onClose, onSubmit }) => {
  const [jugadores, setJugadores] = useState<JugadorOption[]>([]);
  const [idJugador, setIdJugador] = useState<number>(0);
  const [minuto, setMinuto] = useState<number>(1);
  const [descripcion, setDescripcion] = useState<string>('Gol');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!partido) return;
    stubsService.getJugadores().then((res) => {
      setJugadores(res);
      if (res.length > 0) setIdJugador(res[0].id_jugador);
    });
  }, [partido]);

  if (!partido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        id_partido: partido.id_partido,
        id_jugador: Number(idJugador),
        minuto: Number(minuto),
        descripcion: descripcion.trim(),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Trophy className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800">Registrar Gol / Punto</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Jugador Autor</label>
            <select value={idJugador} onChange={(e) => setIdJugador(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {jugadores.map((j) => (
                <option key={j.id_jugador} value={j.id_jugador}>
                  {j.nombre} {j.apellido || ''} (ID: {j.id_jugador})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Minuto de la Anotación</label>
            <input type="number" min="1" max="150" value={minuto} onChange={(e) => setMinuto(Number(e.target.value))} required className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tipo / Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Ej. Gol de jugada colectiva, Tiro libre" className="w-full border rounded-lg p-2" />
          </div>
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Guardando...' : 'Anotar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
