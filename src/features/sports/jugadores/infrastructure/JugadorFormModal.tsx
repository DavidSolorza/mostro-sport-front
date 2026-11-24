import React, { useEffect, useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { HttpError } from '../../../../core/errors/HttpError';
import { jugadoresService } from '../application/jugadoresService';
import { CreateJugadorDto, Jugador, PosicionEspacialOption } from '../domain/jugadorModels';

interface JugadorFormModalProps {
  jugadorToEdit: Jugador | null;
  onClose: () => void;
  onSubmit: (dto: CreateJugadorDto) => Promise<void>;
}

export const JugadorFormModal: React.FC<JugadorFormModalProps> = ({ jugadorToEdit, onClose, onSubmit }) => {
  const [nombre, setNombre] = useState(jugadorToEdit?.nombre ?? '');
  const [apellido, setApellido] = useState(jugadorToEdit?.apellido ?? '');
  const [documento, setDocumento] = useState(jugadorToEdit?.documento ?? '');
  const [fechaNacimiento, setFechaNacimiento] = useState(toDateInput(jugadorToEdit?.fechaNacimiento));
  const [posicionId, setPosicionId] = useState(jugadorToEdit?.posicionId ? String(jugadorToEdit.posicionId) : '');
  const [posiciones, setPosiciones] = useState<PosicionEspacialOption[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{ nombre?: string; documento?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(jugadorToEdit);

  useEffect(() => {
    jugadoresService
      .posiciones()
      .then(setPosiciones)
      .catch(() => setPosiciones([]));
  }, []);

  const handleSubmit = async (): Promise<void> => {
    const errors: { nombre?: string; documento?: string } = {};
    if (!nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!documento.trim()) errors.documento = 'El documento es obligatorio.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        documento: documento.trim(),
        ...(apellido.trim() ? { apellido: apellido.trim() } : {}),
        ...(fechaNacimiento ? { fechaNacimiento } : {}),
        ...(posicionId ? { posicionId: Number(posicionId) } : {}),
      });
    } catch (err) {
      if (err instanceof HttpError && err.status === 409 && /documento/i.test(err.message)) {
        setFieldErrors({ documento: err.message });
      } else {
        setError(toUserMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      title={isEditing ? 'Editar Jugador' : 'Registrar Nuevo Jugador'}
      submitLabel={isEditing ? 'Actualizar' : 'Crear Jugador'}
      loading={loading}
      error={error}
      size="lg"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre" error={fieldErrors.nombre}>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass(Boolean(fieldErrors.nombre))} />
        </Field>
        <Field label="Apellido">
          <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className={inputClass()} />
        </Field>
      </div>
      <Field label="Documento de identidad" error={fieldErrors.documento}>
        <input
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="Identificador unico"
          className={inputClass(Boolean(fieldErrors.documento))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fecha de nacimiento">
          <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className={inputClass()} />
        </Field>
        <Field label="Posicion">
          <select value={posicionId} onChange={(e) => setPosicionId(e.target.value)} className={inputClass()}>
            <option value="">Sin posicion</option>
            {posiciones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </FormModal>
  );
};
