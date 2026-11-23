import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { inputClass } from '../../shared/ui/Field';
import { IconButton } from '../../shared/ui/IconButton';
import { escenariosService } from '../../escenarios/application/escenariosService';
import { Escenario } from '../../escenarios/domain/escenarioModels';
import { torneosService } from '../application/torneosService';
import { Torneo } from '../domain/torneoModels';

export const EscenariosTorneoTab: React.FC<{ torneo: Torneo }> = ({ torneo }) => {
  const [asignados, setAsignados] = useState<Escenario[]>([]);
  const [todos, setTodos] = useState<Escenario[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [mine, all] = await Promise.all([torneosService.escenariosDeTorneo(torneo.id), escenariosService.listarActivos()]);
      setAsignados(mine);
      setTodos(all);
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [torneo.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAssign = async (): Promise<void> => {
    if (!selected) return;
    try {
      await torneosService.asignarEscenario(torneo.id, Number(selected));
      setSelected('');
      setNotice('Escenario asignado al torneo correctamente.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const handleRemove = async (escenarioId: number): Promise<void> => {
    try {
      await torneosService.quitarEscenario(torneo.id, escenarioId);
      setNotice('Escenario retirado del torneo.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const opciones = todos.filter((e) => !asignados.some((a) => a.id === e.id));

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Escenarios del torneo</h2>
        <p className="text-xs text-slate-500 mt-0.5">Sedes donde se disputaran los partidos.</p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <div className="flex items-center gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className={inputClass()}>
          <option value="">Seleccione un escenario...</option>
          {opciones.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void handleAssign()}
          disabled={!selected}
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 shrink-0"
        >
          Asignar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : asignados.length === 0 ? (
        <p className="text-xs text-slate-500 italic">El torneo no tiene escenarios asignados.</p>
      ) : (
        <ul className="divide-y divide-slate-200 text-xs text-slate-800">
          {asignados.map((e) => (
            <li key={e.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold">{e.nombre}</p>
                {e.direccion && <p className="text-[11px] text-slate-400">{e.direccion}</p>}
              </div>
              <IconButton title="Quitar escenario" icon={Trash2} tone="danger" onClick={() => void handleRemove(e.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
