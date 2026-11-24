import React, { useCallback, useEffect, useState } from 'react';
import { Edit2, UserMinus, UserPlus } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { IconButton } from '../../shared/ui/IconButton';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { equiposService } from '../application/equiposService';
import { EquipoJugador } from '../domain/equipoModels';
import { VinculoJugadorModal } from './VinculoJugadorModal';

const nombreJugador = (v: EquipoJugador): string =>
  v.jugador ? `${v.jugador.nombre} ${v.jugador.apellido ?? ''}`.trim() : `Jugador #${v.jugadorId}`;

const esVigente = (v: EquipoJugador): boolean => !v.fechaFin || toDateInput(v.fechaFin) >= new Date().toISOString().slice(0, 10);

export const EquipoPlantillaPanel: React.FC<{ equipoId: number }> = ({ equipoId }) => {
  const [rows, setRows] = useState<EquipoJugador[]>([]);
  const [soloVigentes, setSoloVigentes] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState<EquipoJugador | null>(null);
  const [toRetire, setToRetire] = useState<EquipoJugador | null>(null);
  const [retiring, setRetiring] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      setRows(await equiposService.jugadoresDeEquipo(equipoId, soloVigentes ? true : undefined));
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [equipoId, soloVigentes]);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmRetire = async (): Promise<void> => {
    if (!toRetire) return;
    setRetiring(true);
    try {
      await equiposService.retirarJugador(equipoId, toRetire.jugadorId);
      setNotice('Jugador retirado del equipo. Su historial se conserva.');
      await load();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setRetiring(false);
      setToRetire(null);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Plantilla del equipo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Jugadores con su fecha de inicio y fin de contrato.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" checked={soloVigentes} onChange={(e) => setSoloVigentes(e.target.checked)} />
            Solo vigentes
          </label>
          <button
            type="button"
            onClick={() => {
              setToEdit(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Asignar jugador</span>
          </button>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(v) => `${v.jugadorId}-${v.fechaInicio ?? ''}`}
        emptyIcon={UserPlus}
        emptyTitle="El equipo no tiene jugadores asignados"
        emptyHint="Asigne jugadores para conformar la plantilla."
        columns={[
          {
            header: 'Jugador',
            cell: (v) => (
              <div>
                <p className="font-semibold text-slate-900">{nombreJugador(v)}</p>
                {v.jugador?.documento && <p className="text-[11px] text-slate-400">Doc: {v.jugador.documento}</p>}
              </div>
            ),
          },
          { header: 'Inicio de contrato', cell: (v) => toDateInput(v.fechaInicio) || '-' },
          { header: 'Fin de contrato', cell: (v) => toDateInput(v.fechaFin) || '-' },
          {
            header: 'Vinculo',
            cell: (v) => (esVigente(v) ? <StatusBadge tone="emerald" label="Vigente" /> : <StatusBadge tone="slate" label="Cerrado" />),
          },
        ]}
        actions={(v) => (
          <>
            <IconButton
              title="Editar fechas del contrato"
              icon={Edit2}
              onClick={() => {
                setToEdit(v);
                setModalOpen(true);
              }}
            />
            <IconButton title="Retirar jugador" icon={UserMinus} tone="danger" onClick={() => setToRetire(v)} />
          </>
        )}
      />

      {modalOpen && (
        <VinculoJugadorModal
          equipoId={equipoId}
          vinculoToEdit={toEdit}
          onClose={() => setModalOpen(false)}
          onSaved={async (msg) => {
            setModalOpen(false);
            setNotice(msg);
            await load();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(toRetire)}
        title="Retirar jugador"
        message={`Se cerrara el vinculo de ${toRetire ? nombreJugador(toRetire) : ''} con el equipo. El jugador no se elimina y su historial de traspasos se conserva.`}
        confirmLabel="Retirar"
        isLoading={retiring}
        onConfirm={() => void confirmRetire()}
        onCancel={() => setToRetire(null)}
      />
    </section>
  );
};
