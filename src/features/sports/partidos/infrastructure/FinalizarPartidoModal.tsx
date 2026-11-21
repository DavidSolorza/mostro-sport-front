import React, { useState } from 'react';
import { Partido, FinalizarPartidoDto } from '../domain/partidoModels';
import { X, CheckCircle2 } from 'lucide-react';

interface Props {
  partido: Partido | null;
  onClose: () => void;
  onSubmit: (id: number, dto: FinalizarPartidoDto) => Promise<void>;
}

export const FinalizarPartidoModal: React.FC<Props> = ({ partido, onClose, onSubmit }) => {
  const [esEmpate, setEsEmpate] = useState<boolean>(false);
  const [idGanador, setIdGanador] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  if (!partido) return null;

  const local = partido.partidoEquipos?.find((pe) => pe.rol === 'LOCAL');
  const visitante = partido.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(partido.id_partido, {
        es_empate: esEmpate,
        id_equipo_ganador: esEmpate ? undefined : idGanador,
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
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800">Finalizar Encuentro</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Al finalizar el partido, las apuestas asociadas se liquidarán automáticamente como GANADA o PERDIDA.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border">
            <input
              type="checkbox"
              id="empate-check"
              checked={esEmpate}
              onChange={(e) => {
                setEsEmpate(e.target.checked);
                if (e.target.checked) setIdGanador(undefined);
              }}
              className="rounded text-indigo-600"
            />
            <label htmlFor="empate-check" className="font-semibold text-slate-700 cursor-pointer">
              Declarar Empate Oficial
            </label>
          </div>

          {!esEmpate && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipo Ganador</label>
              <select
                value={idGanador || ''}
                onChange={(e) => setIdGanador(e.target.value ? Number(e.target.value) : undefined)}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">Selecciona al ganador...</option>
                {local && <option value={local.id_equipo}>{local.equipo?.nombre || 'Local'}</option>}
                {visitante && <option value={visitante.id_equipo}>{visitante.equipo?.nombre || 'Visitante'}</option>}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-slate-900 hover:bg-black text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Liquidando...' : 'Confirmar Final'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
