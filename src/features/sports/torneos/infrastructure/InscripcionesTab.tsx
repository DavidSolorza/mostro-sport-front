import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { inputClass } from '../../shared/ui/Field';
import { IconButton } from '../../shared/ui/IconButton';
import { deportesService } from '../../deportes/application/deportesService';
import { Equipo } from '../../equipos/domain/equipoModels';
import { torneosService } from '../application/torneosService';
import { Torneo } from '../domain/torneoModels';

export const InscripcionesTab: React.FC<{ torneo: Torneo }> = ({ torneo }) => {
  const [inscritos, setInscritos] = useState<Equipo[]>([]);
  const [candidatos, setCandidatos] = useState<Equipo[]>([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [toRetire, setToRetire] = useState<Equipo | null>(null);
  const [retiring, setRetiring] = useState(false);

  const abiertas = torneo.estado === 'INSCRIPCIONES_ABIERTAS';

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [ins, deDeporte] = await Promise.all([
        torneosService.equiposInscritos(torneo.id),
        torneo.deporteId ? deportesService.equiposDeDeporte(torneo.deporteId) : Promise.resolve<Equipo[]>([]),
      ]);
      setInscritos(ins);
      setCandidatos(deDeporte);
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [torneo.id, torneo.deporteId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleInscribir = async (): Promise<void> => {
    if (!selected) return;
    try {
      await torneosService.inscribir(torneo.id, Number(selected));
      setSelected('');
      setNotice('Equipo inscrito correctamente.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const confirmRetire = async (): Promise<void> => {
    if (!toRetire) return;
    setRetiring(true);
    try {
      await torneosService.retirarInscripcion(torneo.id, toRetire.id);
      setNotice('Inscripcion retirada correctamente. El equipo y el torneo no se eliminan.');
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setRetiring(false);
      setToRetire(null);
    }
  };

  const opciones = candidatos.filter((c) => !inscritos.some((i) => i.id === c.id));

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Equipos inscritos</h2>
        <p className="text-xs text-slate-500 mt-0.5">Solo pueden inscribirse equipos asociados al deporte del torneo.</p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      {!abiertas && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Las inscripciones y los retiros estan bloqueados porque el torneo no esta en estado "Inscripciones abiertas".
        </p>
      )}

      <div className="flex items-center gap-2">
        <select value={selected} onChange={(e) => setSelected(e.target.value)} disabled={!abiertas} className={inputClass()}>
          <option value="">Seleccione un equipo del deporte...</option>
          {opciones.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void handleInscribir()}
          disabled={!abiertas || !selected}
          className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 shrink-0"
        >
          Inscribir
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : inscritos.length === 0 ? (
        <p className="text-xs text-slate-500 italic">El torneo no tiene equipos inscritos.</p>
      ) : (
        <ul className="divide-y divide-slate-200 text-xs text-slate-800">
          {inscritos.map((e) => (
            <li key={e.id} className="flex items-center justify-between py-2">
              <span className="font-semibold">{e.nombre}</span>
              <IconButton title="Retirar inscripcion" icon={Trash2} tone="danger" disabled={!abiertas} onClick={() => setToRetire(e)} />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={Boolean(toRetire)}
        title="Retirar inscripcion"
        message={`Se retirara a "${toRetire?.nombre ?? ''}" del torneo. El equipo y el torneo no se eliminan.`}
        confirmLabel="Retirar"
        isLoading={retiring}
        onConfirm={() => void confirmRetire()}
        onCancel={() => setToRetire(null)}
      />
    </section>
  );
};
