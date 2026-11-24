import React, { useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toUserMessage } from '../../shared/errorMessage';
import { ESTADOS_TORNEO, ESTADO_TORNEO_LABEL, EstadoTorneo, Torneo } from '../domain/torneoModels';

interface CambiarEstadoTorneoModalProps {
  torneo: Torneo;
  onClose: () => void;
  onSubmit: (estado: EstadoTorneo) => Promise<void>;
}

export const CambiarEstadoTorneoModal: React.FC<CambiarEstadoTorneoModalProps> = ({ torneo, onClose, onSubmit }) => {
  const [estado, setEstado] = useState<EstadoTorneo>(torneo.estado);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (estado === torneo.estado) {
      setError('Seleccione un estado distinto al actual.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(estado);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title="Cambiar estado del torneo" submitLabel="Aplicar" loading={loading} error={error} onClose={onClose} onSubmit={handleSubmit}>
      <p className="text-xs text-slate-600">
        Torneo: <span className="font-semibold text-slate-900">{torneo.nombre}</span>
      </p>
      <Field label="Nuevo estado">
        <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoTorneo)} className={inputClass()}>
          {ESTADOS_TORNEO.map((s) => (
            <option key={s} value={s}>
              {ESTADO_TORNEO_LABEL[s]}
            </option>
          ))}
        </select>
      </Field>
      <p className="text-[11px] text-slate-500">Al iniciar el torneo o cerrar inscripciones, el sistema bloquea nuevas inscripciones y retiros.</p>
    </FormModal>
  );
};
