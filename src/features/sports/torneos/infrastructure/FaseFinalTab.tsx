import React, { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { isNotFound, toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { Field, inputClass } from '../../shared/ui/Field';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { torneosService } from '../application/torneosService';
import { Fase, FaseFinal, MODALIDADES_FINAL, ModalidadFinal, Torneo } from '../domain/torneoModels';

export const FaseFinalTab: React.FC<{ torneo: Torneo }> = ({ torneo }) => {
  const [faseFinal, setFaseFinal] = useState<FaseFinal | null>(null);
  const [fasesFinal, setFasesFinal] = useState<Fase[]>([]);
  const [faseId, setFaseId] = useState('');
  const [modalidad, setModalidad] = useState<ModalidadFinal>('SEMIFINAL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const fases = await torneosService.fases(torneo.id);
      setFasesFinal(fases.filter((f) => f.tipo === 'FINAL'));
      try {
        const ff = await torneosService.obtenerFaseFinal(torneo.id);
        setFaseFinal(ff);
        setModalidad(ff.modalidad);
      } catch (err) {
        if (!isNotFound(err)) throw err;
        setFaseFinal(null);
      }
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

  const handleSave = async (): Promise<void> => {
    setBusy(true);
    try {
      if (faseFinal) {
        await torneosService.actualizarFaseFinal(torneo.id, modalidad);
        setNotice('Fase final actualizada correctamente.');
      } else {
        if (!faseId) {
          setError('Seleccione la fase de tipo FINAL.');
          return;
        }
        await torneosService.definirFaseFinal(torneo.id, Number(faseId), modalidad);
        setNotice('Fase final definida correctamente.');
      }
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setBusy(true);
    try {
      await torneosService.eliminarFaseFinal(torneo.id);
      setNotice('Fase final eliminada correctamente.');
      setFaseFinal(null);
      setError(null);
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Fase final</h2>
          <p className="text-xs text-slate-500 mt-0.5">Etapas decisivas del torneo (llaves).</p>
        </div>
        {faseFinal ? <StatusBadge tone="emerald" label="Definida" /> : <StatusBadge tone="slate" label="Sin definir" />}
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : (
        <div className="space-y-3 max-w-md">
          {!faseFinal && (
            <Field label="Fase del torneo (tipo FINAL)">
              <select value={faseId} onChange={(e) => setFaseId(e.target.value)} className={inputClass()}>
                <option value="">Seleccione una fase...</option>
                {fasesFinal.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
              {fasesFinal.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  El torneo no tiene fases de tipo FINAL. Las fases se crean desde la API (entidad sin interfaz).
                </p>
              )}
            </Field>
          )}

          <Field label="Modalidad">
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value as ModalidadFinal)} className={inputClass()}>
              {MODALIDADES_FINAL.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={busy || (!faseFinal && fasesFinal.length === 0)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {faseFinal ? 'Actualizar modalidad' : 'Definir fase final'}
            </button>
            {faseFinal && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
                className="rounded-lg border border-rose-200 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                Eliminar fase final
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Eliminar fase final"
        message="Se eliminara la fase final del torneo. Si tiene partidos asociados, el sistema no lo permitira."
        confirmLabel="Eliminar"
        isLoading={busy}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </section>
  );
};
