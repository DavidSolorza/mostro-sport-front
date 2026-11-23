import React, { useEffect, useState } from 'react';
import { FormModal } from '../../shared/ui/FormModal';
import { Field, inputClass } from '../../shared/ui/Field';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { jugadoresService } from '../../jugadores/application/jugadoresService';
import { Jugador } from '../../jugadores/domain/jugadorModels';
import { equiposService } from '../application/equiposService';
import { EquipoJugador } from '../domain/equipoModels';

interface VinculoJugadorModalProps {
  equipoId: number;
  vinculoToEdit: EquipoJugador | null;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
}

export const VinculoJugadorModal: React.FC<VinculoJugadorModalProps> = ({ equipoId, vinculoToEdit, onClose, onSaved }) => {
  const isEditing = Boolean(vinculoToEdit);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [jugadorId, setJugadorId] = useState(vinculoToEdit ? String(vinculoToEdit.jugadorId) : '');
  const [fechaInicio, setFechaInicio] = useState(toDateInput(vinculoToEdit?.fechaInicio));
  const [fechaFin, setFechaFin] = useState(toDateInput(vinculoToEdit?.fechaFin));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) return;
    jugadoresService
      .listarActivos()
      .then(setJugadores)
      .catch((err: unknown) => setError(toUserMessage(err)));
  }, [isEditing]);

  const handleSubmit = async (): Promise<void> => {
    if (!isEditing && !jugadorId) {
      setError('Seleccione un jugador.');
      return;
    }
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      setError('La fecha de fin del contrato no puede ser anterior a la fecha de inicio.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fechas = {
        ...(fechaInicio ? { fechaInicio } : {}),
        ...(fechaFin ? { fechaFin } : {}),
      };
      if (vinculoToEdit) {
        await equiposService.actualizarVinculo(equipoId, vinculoToEdit.jugadorId, fechas);
        await onSaved('Contrato actualizado correctamente.');
      } else {
        await equiposService.asociarJugador(equipoId, { jugadorId: Number(jugadorId), ...fechas });
        await onSaved('Jugador asignado al equipo correctamente.');
      }
    } catch (err) {
      setError(toUserMessage(err));
      setLoading(false);
    }
  };

  return (
    <FormModal
      title={isEditing ? 'Editar contrato' : 'Asignar jugador al equipo'}
      submitLabel={isEditing ? 'Actualizar' : 'Asignar'}
      loading={loading}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {!isEditing && (
        <Field label="Jugador">
          <select value={jugadorId} onChange={(e) => setJugadorId(e.target.value)} className={inputClass()}>
            <option value="">Seleccione un jugador...</option>
            {jugadores.map((j) => (
              <option key={j.id} value={j.id}>
                {`${j.nombre} ${j.apellido ?? ''}`.trim()} - {j.documento}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Inicio del contrato">
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputClass()} />
        </Field>
        <Field label="Fin del contrato">
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass()} />
        </Field>
      </div>
    </FormModal>
  );
};
