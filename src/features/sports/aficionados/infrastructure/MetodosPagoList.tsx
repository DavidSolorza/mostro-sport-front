import React, { useState } from 'react';
import { MetodoPagoAficionado } from '../domain/aficionadoModels';
import { MetodoPagoCatalogoOption } from '../../stubs/domain/stubModels';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface Props {
  metodos: MetodoPagoAficionado[];
  catalogo: MetodoPagoCatalogoOption[];
  onAgregar: (idMetodoPago: number, referencia: string) => Promise<void>;
  onEliminar: (id: number) => Promise<void>;
}

export const MetodosPagoList: React.FC<Props> = ({ metodos, catalogo, onAgregar, onEliminar }) => {
  const [idMetodo, setIdMetodo] = useState<number>(catalogo[0]?.id_metodo_pago || 1);
  const [referencia, setReferencia] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referencia.trim()) return;
    setLoading(true);
    try {
      await onAgregar(Number(idMetodo), referencia.trim());
      setReferencia('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-indigo-600" /> Métodos de Pago Asociados (HU-GC-10)
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <select
          value={idMetodo}
          onChange={(e) => setIdMetodo(Number(e.target.value))}
          className="border rounded-lg p-2 text-xs"
        >
          {catalogo.map((cat) => (
            <option key={cat.id_metodo_pago} value={cat.id_metodo_pago}>{cat.nombre}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Ref. Ej: **** 4321 / Bancolombia"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          required
          className="border rounded-lg p-2 text-xs flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar
        </button>
      </form>
      <div className="divide-y text-xs">
        {metodos.map((m) => (
          <div key={m.id_metodo_aficionado} className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-700">{m.metodoPago?.nombre || 'Método'}</span>
              <p className="text-slate-400 text-[11px] font-mono">{m.referencia}</p>
            </div>
            <button
              onClick={() => onEliminar(m.id_metodo_aficionado)}
              className="text-rose-500 hover:text-rose-700 p-1 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
