import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { inputClass } from '../../shared/ui/Field';
import { IconButton } from '../../shared/ui/IconButton';
import { deportesService } from '../../deportes/application/deportesService';
import { Deporte } from '../../deportes/domain/deporteModels';
import { equiposService } from '../application/equiposService';

export const EquipoDeportesPanel: React.FC<{ equipoId: number }> = ({ equipoId }) => {
  const [asociados, setAsociados] = useState<Deporte[]>([]);
  const [disponibles, setDisponibles] = useState<Deporte[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [mine, all] = await Promise.all([equiposService.deportesDeEquipo(equipoId), deportesService.listarActivos()]);
      setAsociados(mine);
      setDisponibles(all);
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [equipoId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async (): Promise<void> => {
    if (!selected) return;
    try {
      await equiposService.asociarDeporte(equipoId, Number(selected));
      setSelected('');
      setNotice('Deporte asociado al equipo correctamente.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const handleRemove = async (deporteId: number): Promise<void> => {
    try {
      await equiposService.quitarDeporte(equipoId, deporteId);
      setNotice('Asociacion retirada. El equipo y el deporte no se eliminan.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const opciones = disponibles.filter((d) => !asociados.some((a) => a.id === d.id));

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Deportes del equipo</h2>
        <p className="text-xs text-slate-500 mt-0.5">Disciplinas en las que puede competir este equipo.</p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <div className="flex items-center gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className={inputClass()}>
          <option value="">Seleccione un deporte...</option>
          {opciones.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={!selected}
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 shrink-0"
        >
          Asociar
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : asociados.length === 0 ? (
        <p className="text-xs text-slate-500 italic">El equipo no tiene deportes asociados.</p>
      ) : (
        <ul className="divide-y divide-slate-200 text-xs text-slate-800">
          {asociados.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-2">
              <span className="font-semibold">{d.nombre}</span>
              <IconButton title="Quitar asociacion" icon={Trash2} tone="danger" onClick={() => void handleRemove(d.id)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
