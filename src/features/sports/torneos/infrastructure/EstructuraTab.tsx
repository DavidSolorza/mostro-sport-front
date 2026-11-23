import React, { useEffect, useState } from 'react';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { torneosService } from '../application/torneosService';
import { ESTADO_TORNEO_LABEL, Torneo, TorneoEstructura } from '../domain/torneoModels';
import { ESTADO_TORNEO_TONE } from './torneoBadges';

export const EstructuraTab: React.FC<{ torneo: Torneo }> = ({ torneo }) => {
  const [estructura, setEstructura] = useState<TorneoEstructura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    torneosService
      .estructura(torneo.id)
      .then(setEstructura)
      .catch((err: unknown) => setError(toUserMessage(err)))
      .finally(() => setLoading(false));
  }, [torneo.id]);

  const fases = estructura?.fases ?? [];

  return (
    <div className="space-y-4">
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Informacion general</h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <dt className="text-slate-500">Deporte</dt>
            <dd className="font-semibold text-slate-900">{torneo.deporte?.nombre ?? (torneo.deporteId ? `#${torneo.deporteId}` : '-')}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Inicio</dt>
            <dd className="font-semibold text-slate-900">{toDateInput(torneo.fechaInicio)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Fin</dt>
            <dd className="font-semibold text-slate-900">{toDateInput(torneo.fechaFin)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Cierre de inscripciones</dt>
            <dd className="font-semibold text-slate-900">{toDateInput(torneo.fechaCierreInscripciones) || '-'}</dd>
          </div>
        </dl>
        <div className="mt-3">
          <StatusBadge tone={ESTADO_TORNEO_TONE[torneo.estado] ?? 'slate'} label={ESTADO_TORNEO_LABEL[torneo.estado] ?? torneo.estado} />
        </div>
      </section>

      <ErrorBanner message={error} />

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Estructura de la competencia</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fases, grupos y equipos (solo lectura).</p>
        </div>
        {loading ? (
          <p className="text-xs text-slate-400">Cargando...</p>
        ) : fases.length === 0 ? (
          <p className="text-xs text-slate-500 italic">El torneo aun no tiene fases registradas.</p>
        ) : (
          <ol className="space-y-3">
            {[...fases]
              .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
              .map((f) => (
                <li key={f.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900">
                      {f.orden ? `${f.orden}. ` : ''}
                      {f.nombre}
                    </p>
                    <StatusBadge tone="indigo" label={f.tipo === 'FINAL' ? 'Final' : 'Grupos'} />
                  </div>
                  {(f.grupos ?? []).length > 0 && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(f.grupos ?? []).map((g) => (
                        <div key={g.id} className="rounded-md bg-slate-50 border border-slate-200 p-2">
                          <p className="text-[11px] font-semibold text-slate-700">{g.nombreGrupo}</p>
                          <p className="text-[11px] text-slate-500">
                            {(g.equipos ?? []).length > 0 ? (g.equipos ?? []).map((e) => e.nombre).join(', ') : 'Sin equipos'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
          </ol>
        )}
      </section>
    </div>
  );
};
