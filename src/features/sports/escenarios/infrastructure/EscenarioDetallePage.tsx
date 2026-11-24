import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Plus } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { ActivoBadge, StatusBadge } from '../../shared/ui/StatusBadge';
import { torneosService } from '../../torneos/application/torneosService';
import { Torneo, ESTADO_TORNEO_LABEL } from '../../torneos/domain/torneoModels';
import { escenariosService } from '../application/escenariosService';
import { Escenario } from '../domain/escenarioModels';
import { EscenarioFormModal, EscenarioFormValues } from './EscenarioFormModal';

export const EscenarioDetallePage: React.FC = () => {
  const { escenarioId } = useParams<{ escenarioId: string }>();
  const id = Number(escenarioId);
  const [escenario, setEscenario] = useState<Escenario | null>(null);
  const [subs, setSubs] = useState<Escenario[]>([]);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [esc, hijos, ts] = await Promise.all([
        escenariosService.obtener(id),
        escenariosService.subescenarios(id),
        torneosService.torneosDeEscenario(id),
      ]);
      setEscenario(esc);
      setSubs(hijos);
      setTorneos(ts);
      setError(null);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreateSub = async (values: EscenarioFormValues): Promise<void> => {
    await escenariosService.crearSubescenario(id, values);
    setModalOpen(false);
    setNotice('Subescenario registrado correctamente.');
    await load();
  };

  return (
    <div className="space-y-4">
      <Link to="/sports/escenarios" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a escenarios
      </Link>

      <div className="flex items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{escenario?.nombre ?? `Escenario #${id}`}</h1>
            {escenario && <ActivoBadge activo={escenario.activo ?? true} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{escenario?.direccion || 'Sin direccion registrada'}</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Subescenarios</h2>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Subescenario</span>
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={subs}
        rowKey={(s) => s.id}
        emptyIcon={Building2}
        emptyTitle="Este escenario no tiene subescenarios"
        emptyHint="Cree un subescenario para dividir el complejo."
        columns={[
          { header: 'Subescenario', cell: (s) => <span className="font-semibold text-slate-900">{s.nombre}</span> },
          { header: 'Direccion', cell: (s) => s.direccion || '-' },
          { header: 'Estado', cell: (s) => <ActivoBadge activo={s.activo ?? true} /> },
        ]}
      />

      <h2 className="text-sm font-bold text-slate-900 pt-2">Torneos que lo utilizan</h2>
      {torneos.length === 0 ? (
        <p className="text-xs text-slate-500 italic">Ningun torneo tiene asignado este escenario.</p>
      ) : (
        <ul className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-200 text-xs text-slate-800">
          {torneos.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-5 py-3">
              <Link to={`/sports/torneos/${t.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
                {t.nombre}
              </Link>
              <StatusBadge tone="indigo" label={ESTADO_TORNEO_LABEL[t.estado] ?? t.estado} />
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <EscenarioFormModal
          title="Registrar Subescenario"
          submitLabel="Crear Subescenario"
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateSub}
        />
      )}
    </div>
  );
};
