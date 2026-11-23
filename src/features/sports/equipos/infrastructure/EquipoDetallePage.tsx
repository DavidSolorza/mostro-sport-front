import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { ActivoBadge, StatusBadge } from '../../shared/ui/StatusBadge';
import { torneosService } from '../../torneos/application/torneosService';
import { ESTADO_TORNEO_LABEL, Torneo } from '../../torneos/domain/torneoModels';
import { equiposService } from '../application/equiposService';
import { Equipo } from '../domain/equipoModels';
import { EquipoDeportesPanel } from './EquipoDeportesPanel';
import { EquipoPlantillaPanel } from './EquipoPlantillaPanel';

type Tab = 'deportes' | 'plantilla' | 'torneos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'deportes', label: 'Deportes' },
  { id: 'plantilla', label: 'Plantilla' },
  { id: 'torneos', label: 'Torneos' },
];

const EquipoTorneosPanel: React.FC<{ equipoId: number }> = ({ equipoId }) => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    torneosService
      .torneosDeEquipo(equipoId)
      .then(setTorneos)
      .catch((err: unknown) => setError(toUserMessage(err)))
      .finally(() => setLoading(false));
  }, [equipoId]);

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Torneos del equipo</h2>
        <p className="text-xs text-slate-500 mt-0.5">Competencias en las que esta inscrito. Las inscripciones se gestionan desde cada torneo.</p>
      </div>
      <ErrorBanner message={error} />
      {loading ? (
        <p className="text-xs text-slate-400">Cargando...</p>
      ) : torneos.length === 0 ? (
        <p className="text-xs text-slate-500 italic">El equipo no esta inscrito en ningun torneo.</p>
      ) : (
        <ul className="divide-y divide-slate-200 text-xs text-slate-800">
          {torneos.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-2">
              <Link to={`/sports/torneos/${t.id}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
                {t.nombre}
              </Link>
              <StatusBadge tone="indigo" label={ESTADO_TORNEO_LABEL[t.estado] ?? t.estado} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export const EquipoDetallePage: React.FC = () => {
  const { equipoId } = useParams<{ equipoId: string }>();
  const id = Number(equipoId);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('deportes');

  useEffect(() => {
    equiposService
      .obtener(id)
      .then(setEquipo)
      .catch((err: unknown) => setError(toUserMessage(err)));
  }, [id]);

  return (
    <div className="space-y-4">
      <Link to="/sports/equipos" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a equipos
      </Link>

      <div className="flex items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{equipo?.nombre ?? `Equipo #${id}`}</h1>
            {equipo && <ActivoBadge activo={equipo.activo ?? true} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{equipo?.genero ? `Genero: ${equipo.genero}` : 'Detalle del equipo'}</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'deportes' && <EquipoDeportesPanel equipoId={id} />}
      {tab === 'plantilla' && <EquipoPlantillaPanel equipoId={id} />}
      {tab === 'torneos' && <EquipoTorneosPanel equipoId={id} />}
    </div>
  );
};
