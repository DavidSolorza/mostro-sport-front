import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { torneosService } from '../application/torneosService';
import { ESTADO_TORNEO_LABEL, Torneo } from '../domain/torneoModels';
import { EscenariosTorneoTab } from './EscenariosTorneoTab';
import { EstructuraTab } from './EstructuraTab';
import { FaseFinalTab } from './FaseFinalTab';
import { InscripcionesTab } from './InscripcionesTab';
import { ESTADO_TORNEO_TONE } from './torneoBadges';

type Tab = 'resumen' | 'inscripciones' | 'fase-final' | 'escenarios';

const TABS: { id: Tab; label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'inscripciones', label: 'Inscripciones' },
  { id: 'fase-final', label: 'Fase final' },
  { id: 'escenarios', label: 'Escenarios' },
];

export const TorneoGestionPage: React.FC = () => {
  const { torneoId } = useParams<{ torneoId: string }>();
  const id = Number(torneoId);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('resumen');

  useEffect(() => {
    torneosService
      .obtener(id)
      .then(setTorneo)
      .catch((err: unknown) => setError(toUserMessage(err)));
  }, [id]);

  return (
    <div className="space-y-4">
      <Link to="/sports/torneos" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600">
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a torneos
      </Link>

      <div className="flex items-center gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{torneo?.nombre ?? `Torneo #${id}`}</h1>
            {torneo && <StatusBadge tone={ESTADO_TORNEO_TONE[torneo.estado] ?? 'slate'} label={ESTADO_TORNEO_LABEL[torneo.estado] ?? torneo.estado} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Gestion de inscripciones, fase final y escenarios</p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {torneo && (
        <>
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

          {tab === 'resumen' && <EstructuraTab torneo={torneo} />}
          {tab === 'inscripciones' && <InscripcionesTab torneo={torneo} />}
          {tab === 'fase-final' && <FaseFinalTab torneo={torneo} />}
          {tab === 'escenarios' && <EscenariosTorneoTab torneo={torneo} />}
        </>
      )}
    </div>
  );
};
