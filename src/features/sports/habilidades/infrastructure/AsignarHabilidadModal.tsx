import React, { useState, useEffect } from 'react';
import { AsignarHabilidadDto } from '../domain/habilidadModels';
import { stubsService } from '../../stubs/application/stubsService';
import { HabilidadOption } from '../../stubs/domain/stubModels';
import { X, Award, AlertCircle } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: AsignarHabilidadDto) => Promise<void>;
  jugadorId: number;
  asignadasIds?: number[];
}

export const AsignarHabilidadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, jugadorId, asignadasIds = [] }) => {
  const [catalogo, setCatalogo] = useState<HabilidadOption[]>([]);
  const [idHabilidad, setIdHabilidad] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    stubsService
      .getHabilidades()
      .then((res) => {
        setCatalogo(res);
      })
      .catch((err) => setFormError(toUserMessage(err)));
  }, [isOpen]);

  const habilidades = catalogo.filter((h) => !asignadasIds.includes(h.id_habilidad));
  const habilidadSeleccionada = habilidades.some((h) => h.id_habilidad === idHabilidad)
    ? idHabilidad
    : habilidades[0]?.id_habilidad ?? 0;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jugadorId || !habilidadSeleccionada) {
      setFormError('Selecciona un jugador y una habilidad disponible.');
      return;
    }
    setLoading(true);
    setFormError(null);
    try {
      await onSubmit({
        jugadorId: Number(jugadorId),
        habilidadId: Number(habilidadSeleccionada),
      });
      onClose();
    } catch (err) {
      setFormError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Award className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800">Asignar Habilidad</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catálogo de Habilidades</label>
            <select value={habilidadSeleccionada} onChange={(e) => setIdHabilidad(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {habilidades.map((h) => (
                <option key={h.id_habilidad} value={h.id_habilidad}>
                  {h.nombre} {h.descripcion ? `- ${h.descripcion}` : ''}
                </option>
              ))}
            </select>
            {habilidades.length === 0 && (
              <p className="mt-1 text-slate-500">Este jugador ya tiene todas las habilidades del catálogo.</p>
            )}
          </div>
          {formError && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading || habilidades.length === 0} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Asignando...' : 'Asignar Habilidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
