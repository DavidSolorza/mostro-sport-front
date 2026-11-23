import React, { useEffect, useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { deportesService } from '../../deportes/application/deportesService';
import { Deporte } from '../../deportes/domain/deporteModels';
import { CreateTorneoDto, Torneo } from '../domain/torneoModels';

interface TorneoFormModalProps {
  torneoToEdit: Torneo | null;
  onClose: () => void;
  onSubmit: (dto: CreateTorneoDto) => Promise<void>;
}

type FieldKey = 'nombre' | 'fechaInicio' | 'fechaFin' | 'deporteId';

export const TorneoFormModal: React.FC<TorneoFormModalProps> = ({ torneoToEdit, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState(torneoToEdit?.nombre ?? '');
  const [fechaInicio, setFechaInicio] = useState(toDateInput(torneoToEdit?.fechaInicio));
  const [fechaFin, setFechaFin] = useState(toDateInput(torneoToEdit?.fechaFin));
  const [fechaCierre, setFechaCierre] = useState(toDateInput(torneoToEdit?.fechaCierreInscripciones));
  const [deporteId, setDeporteId] = useState(torneoToEdit?.deporteId ? String(torneoToEdit.deporteId) : '');
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(torneoToEdit);

  useEffect(() => {
    deportesService
      .listarActivos()
      .then(setDeportes)
      .catch((err: unknown) => setError(toUserMessage(err)));
  }, []);

  const handleSubmit = async (): Promise<void> => {
    const errors: Partial<Record<FieldKey, string>> = {};
    if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria.';
    if (!fechaFin) errors.fechaFin = 'La fecha de fin es obligatoria.';
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) errors.fechaFin = 'La fecha de fin no puede ser anterior al inicio.';
    if (!deporteId) errors.deporteId = 'Seleccione el deporte del torneo.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        fechaInicio,
        fechaFin,
        deporteId: Number(deporteId),
        ...(fechaCierre ? { fechaCierreInscripciones: fechaCierre } : {}),
      });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      title={isEditing ? 'Editar Torneo' : 'Registrar Nuevo Torneo'}
      submitLabel={isEditing ? 'Actualizar' : 'Crear Torneo'}
      loading={loading}
      error={error}
      size="lg"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Nombre" error={fieldErrors.nombre}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del torneo"
          className={inputClass(Boolean(fieldErrors.nombre))}
        />
      </Field>
      <Field label="Deporte" error={fieldErrors.deporteId}>
        <select value={deporteId} onChange={(e) => setDeporteId(e.target.value)} className={inputClass(Boolean(fieldErrors.deporteId))}>
          <option value="">Seleccione un deporte...</option>
          {deportes.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha de inicio" error={fieldErrors.fechaInicio}>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={inputClass(Boolean(fieldErrors.fechaInicio))}
          />
        </Field>
        <Field label="Fecha de fin" error={fieldErrors.fechaFin}>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className={inputClass(Boolean(fieldErrors.fechaFin))}
          />
        </Field>
      </div>
      <Field label="Cierre de inscripciones">
        <input type="date" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} className={inputClass()} />
      </Field>
    </FormModal>
  );
};
