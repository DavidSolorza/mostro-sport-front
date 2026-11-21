import React, { useState } from 'react';
import { AficionadoEquipo } from '../domain/aficionadoModels';
import { EquipoOption } from '../../stubs/domain/stubModels';
import { Heart, Plus, Trash2 } from 'lucide-react';

interface Props {
  equiposFavoritos: AficionadoEquipo[];
  todosEquipos: EquipoOption[];
  onVincular: (equipoId: number) => Promise<void>;
  onDesvincular: (equipoId: number) => Promise<void>;
}

export const EquiposFavoritosList: React.FC<Props> = ({
  equiposFavoritos,
  todosEquipos,
  onVincular,
  onDesvincular,
}) => {
  const [equipoId, setEquipoId] = useState<number>(todosEquipos[0]?.id_equipo || 1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onVincular(Number(equipoId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <Heart className="w-4 h-4 text-rose-500" /> Equipos Favoritos
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <select
          value={equipoId}
          onChange={(e) => setEquipoId(Number(e.target.value))}
          className="border rounded-lg p-2 text-xs flex-1"
        >
          {todosEquipos.map((eq) => (
            <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Seguir
        </button>
      </form>
      <div className="flex flex-wrap gap-2 pt-2">
        {equiposFavoritos.map((fav) => (
          <span
            key={fav.id_equipo}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-semibold border"
          >
            {fav.equipo?.nombre || `Equipo #${fav.id_equipo}`}
            <button
              onClick={() => onDesvincular(fav.id_equipo)}
              className="hover:text-rose-600 ml-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
