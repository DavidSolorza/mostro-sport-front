import React, { useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { CreateEquipoDto, Equipo, GENEROS_EQUIPO, GeneroEquipo } from '../domain/equipoModels';

interface EquipoFormModalProps {
  equipoToEdit: Equipo | null;
  onClose: () => void;
  onSubmit: (dto: CreateEquipoDto) => Promise<void>;
}

export const EquipoFormModal: React.FC<EquipoFormModalProps> = ({ equipoToEdit, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState(equipoToEdit?.nombre ?? '');
  const [genero, setGenero] = useState<GeneroEquipo | ''>(equipoToEdit?.genero ?? '');
  const [fechaCreacion, setFechaCreacion] = useState(toDateInput(equipoToEdit?.fechaCreacion));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(equipoToEdit);

  const handleSubmit = async (): Promise<void> => {
    if (!nombre.trim()) {
      setError('El nombre del equipo es obligatorio.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        ...(genero ? { genero } : {}),
        ...(fechaCreacion ? { fechaCreacion } : {}),
      });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      title={isEditing ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
      submitLabel={isEditing ? 'Actualizar' : 'Crear Equipo'}
      loading={loading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Field label="Nombre">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del equipo"
          className={inputClass()}
        />
      </Field>
      <Field label="Genero">
        <select value={genero} onChange={(e) => setGenero(e.target.value as GeneroEquipo | '')} className={inputClass()}>
          <option value="">Sin especificar</option>
          {GENEROS_EQUIPO.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Fecha de creacion">
        <input type="date" value={fechaCreacion} onChange={(e) => setFechaCreacion(e.target.value)} className={inputClass()} />
      </Field>
    </FormModal>
  );
};
