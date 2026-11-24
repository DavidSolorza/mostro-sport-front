import React, { useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toUserMessage } from '../../shared/errorMessage';
import { Escenario } from '../domain/escenarioModels';

export interface EscenarioFormValues {
  nombre: string;
  direccion?: string;
}

interface EscenarioFormModalProps {
  title: string;
  submitLabel: string;
  escenarioToEdit?: Escenario | null;
  onClose: () => void;
  onSubmit: (values: EscenarioFormValues) => Promise<void>;
}

/** Sirve para crear/editar un escenario y para crear un subescenario (mismos campos). */
export const EscenarioFormModal: React.FC<EscenarioFormModalProps> = ({
  title,
  submitLabel,
  escenarioToEdit = null,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState(escenarioToEdit?.nombre ?? '');
  const [direccion, setDireccion] = useState(escenarioToEdit?.direccion ?? '');
  const [nombreError, setNombreError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!nombre.trim()) {
      setNombreError('El nombre es obligatorio.');
      return;
    }
    setNombreError(undefined);
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ nombre: nombre.trim(), ...(direccion.trim() ? { direccion: direccion.trim() } : {}) });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal title={title} submitLabel={submitLabel} loading={loading} error={error} onClose={onClose} onSubmit={handleSubmit}>
      <Field label="Nombre" error={nombreError}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del escenario"
          className={inputClass(Boolean(nombreError))}
        />
      </Field>
      <Field label="Direccion">
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} className={inputClass()} />
      </Field>
    </FormModal>
  );
};
