import React, { useState, useEffect } from 'react';
import { EmitirBoletoDto, Localidad } from '../domain/boletoModels';
import { boletosService } from '../application/boletosService';
import { Partido } from '../../partidos/domain/partidoModels';
import { X, Ticket } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: EmitirBoletoDto) => Promise<void>;
  partidos: Partido[];
}

export const EmitirBoletoModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, partidos }) => {
  const [partidoId, setPartidoId] = useState<number>(0);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [localidadId, setLocalidadId] = useState<number>(0);
  const [precio, setPrecio] = useState<number>(25);
  const [codigo, setCodigo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || partidos.length === 0) return;
    const initialP = partidos[0];
    setPartidoId(initialP.id_partido);
    setCodigo(`BOL-${Date.now().toString().slice(-6)}`);
    boletosService.getLocalidadesPorEscenario(initialP.id_escenario).then((locs) => {
      setLocalidades(locs);
      if (locs.length > 0) setLocalidadId(locs[0].id_localidad);
    });
  }, [isOpen, partidos]);

  const handlePartidoChange = async (id: number) => {
    setPartidoId(id);
    const p = partidos.find((item) => item.id_partido === id);
    if (p) {
      const locs = await boletosService.getLocalidadesPorEscenario(p.id_escenario);
      setLocalidades(locs);
      if (locs.length > 0) setLocalidadId(locs[0].id_localidad);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        codigo: codigo || `BOL-${Date.now()}`,
        precio: Number(precio),
        estado: 'DISPONIBLE',
        id_partido: Number(partidoId),
        id_localidad: Number(localidadId),
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
            <Ticket className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800">Emitir Nuevo Boleto</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Partido</label>
            <select value={partidoId} onChange={(e) => handlePartidoChange(Number(e.target.value))} className="w-full border rounded-lg p-2 font-medium">
              {partidos.map((p) => {
                const l = p.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
                const v = p.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Vis';
                return <option key={p.id_partido} value={p.id_partido}>{l} vs {v}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Localidad del Escenario</label>
            <select value={localidadId} onChange={(e) => setLocalidadId(Number(e.target.value))} className="w-full border rounded-lg p-2">
              {localidades.map((loc) => (
                <option key={loc.id_localidad} value={loc.id_localidad}>
                  {loc.nombre} (Capacidad: {loc.capacidad})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Código Único</label>
              <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Precio ($)</label>
              <input type="number" min="0" step="1" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required className="w-full border rounded-lg p-2" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Emitiendo...' : 'Emitir Boleto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
