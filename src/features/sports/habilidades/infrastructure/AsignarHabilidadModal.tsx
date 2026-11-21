import React, { useState, useEffect } from 'react';
import { AsignarHabilidadDto } from '../domain/habilidadModels';
import { stubsService } from '../../stubs/application/stubsService';
import { HabilidadOption } from '../../stubs/domain/stubModels';
import { X, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: AsignarHabilidadDto) => Promise<void>;
  jugadorId: number;
}

export const AsignarHabilidadModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, jugadorId }) => {
  const [habilidades, setHabilidades] = useState<HabilidadOption[]>([]);
  const [idHabilidad, setIdHabilidad] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    stubsService.getHabilidades().then((res) => {
      setHabilidades(res);
      if (res.length > 0) setIdHabilidad(res[0].id_habilidad);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        id_jugador: Number(jugadorId),
        id_habilidad: Number(idHabilidad),
      });
      onClose();
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
            <select value={idHabilidad} onChange={(e) => setIdHabilidad(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {habilidades.map((h) => (
                <option key={h.id_habilidad} value={h.id_habilidad}>
                  {h.nombre} {h.descripcion ? `- ${h.descripcion}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Asignando...' : 'Asignar Habilidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
