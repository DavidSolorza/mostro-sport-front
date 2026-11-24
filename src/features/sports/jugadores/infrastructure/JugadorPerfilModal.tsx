import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { StatusBadge } from '../../shared/ui/StatusBadge';
import { jugadoresService } from '../application/jugadoresService';
import { Jugador, JugadorPerfil } from '../domain/jugadorModels';

interface JugadorPerfilModalProps {
  jugador: Jugador;
  onClose: () => void;
}

export const JugadorPerfilModal: React.FC<JugadorPerfilModalProps> = ({ jugador, onClose }) => {
  const [perfil, setPerfil] = useState<JugadorPerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    jugadoresService
      .perfil(jugador.id)
      .then(setPerfil)
      .catch((err: unknown) => setError(toUserMessage(err)))
      .finally(() => setLoading(false));
  }, [jugador.id]);

  const base = perfil?.jugador ?? perfil ?? jugador;
  const equipos = perfil?.equipos ?? [];
  const habilidades = perfil?.habilidades ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Perfil deportivo</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <ErrorBanner message={error} />
          {loading ? (
            <p className="text-xs text-slate-400">Cargando perfil...</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm">
                  {(base.nombre ?? jugador.nombre).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {`${base.nombre ?? jugador.nombre} ${base.apellido ?? ''}`.trim()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Doc: {base.documento ?? jugador.documento}
                    {toDateInput(base.fechaNacimiento) ? ` · Nacimiento: ${toDateInput(base.fechaNacimiento)}` : ''}
                    {(base.posicion ?? jugador.posicion) ? ` · ${(base.posicion ?? jugador.posicion)?.nombre}` : ''}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Equipos</h3>
                {equipos.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">El jugador no tiene equipos asociados.</p>
                ) : (
                  <ul className="divide-y divide-slate-200 text-xs text-slate-800 border border-slate-200 rounded-lg">
                    {equipos.map((e, i) => (
                      <li key={`${e.equipoId ?? e.equipo?.id}-${i}`} className="flex items-center justify-between px-3 py-2">
                        <span className="font-semibold">{e.equipo?.nombre ?? `Equipo #${e.equipoId}`}</span>
                        <span className="text-slate-500">
                          {toDateInput(e.fechaInicio) || '-'} a {toDateInput(e.fechaFin) || 'vigente'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-700 mb-2">Habilidades</h3>
                {habilidades.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">El jugador no tiene habilidades registradas.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {habilidades.map((h, i) => (
                      <StatusBadge
                        key={`${h.habilidadId ?? h.habilidad?.id}-${i}`}
                        tone="indigo"
                        label={`${h.nombre ?? h.habilidad?.nombre ?? 'Habilidad'}${h.nivel ? ` · ${h.nivel}` : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
