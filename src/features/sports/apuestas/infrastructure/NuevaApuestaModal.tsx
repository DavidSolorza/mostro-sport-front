import React, { useState, useEffect } from 'react';
import { CreateApuestaDto } from '../domain/apuestaModels';
import { apuestasService } from '../application/apuestasService';
import { aficionadosService } from '../../aficionados/application/aficionadosService';
import { MetodoPagoAficionado } from '../../aficionados/domain/aficionadoModels';
import { Partido } from '../../partidos/domain/partidoModels';
import { partidosService } from '../../partidos/application/partidosService';
import { X, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateApuestaDto) => Promise<void>;
  aficionadoId: number;
}

export const NuevaApuestaModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, aficionadoId }) => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidoId, setPartidoId] = useState<number>(0);
  const [metodos, setMetodos] = useState<MetodoPagoAficionado[]>([]);
  const [metodoId, setMetodoId] = useState<number>(0);
  const [monto, setMonto] = useState<number>(50);
  const [cuota, setCuota] = useState<number>(1.85);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      partidosService.getPartidos(),
      aficionadosService.getMetodosPago(aficionadoId),
    ]).then(([res, userMetodos]) => {
      const disponibles = res.filter((p) => p.estado === 'PROGRAMADO' || p.estado === 'EN_CURSO');
      setPartidos(disponibles);
      setMetodos(userMetodos);
      if (disponibles.length > 0) {
        setPartidoId(disponibles[0].id_partido);
        apuestasService.getCuotaPartido(disponibles[0].id_partido).then((c) => setCuota(c.cuota));
      }
      if (userMetodos.length > 0) {
        setMetodoId(userMetodos[0].id_metodo_aficionado);
      }
    });
  }, [isOpen, aficionadoId]);

  const handlePartidoChange = async (id: number) => {
    setPartidoId(id);
    const c = await apuestasService.getCuotaPartido(id);
    setCuota(c.cuota);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metodoId) return;
    setLoading(true);
    try {
      await onSubmit({
        monto: Number(monto),
        id_aficionado: aficionadoId,
        id_partido: Number(partidoId),
        id_metodo_aficionado: Number(metodoId),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const gananciaEstimada = (monto * cuota).toFixed(2);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <DollarSign className="w-5 h-5" />
            <h2 className="text-base font-bold text-slate-800">Colocar Apuesta</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Partido Objetivo</label>
            <select value={partidoId} onChange={(e) => handlePartidoChange(Number(e.target.value))} className="w-full border rounded-lg p-2 font-medium">
              {partidos.map((p) => {
                const l = p.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
                const v = p.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Vis';
                return <option key={p.id_partido} value={p.id_partido}>[{p.estado}] {l} vs {v}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Método de Pago Aficionado</label>
            {metodos.length === 0 ? (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>No tienes métodos de pago. Regístralo en tu Perfil de Aficionado.</span>
              </div>
            ) : (
              <select value={metodoId} onChange={(e) => setMetodoId(Number(e.target.value))} className="w-full border rounded-lg p-2 font-medium">
                {metodos.map((m) => (
                  <option key={m.id_metodo_aficionado} value={m.id_metodo_aficionado}>
                    {m.metodoPago?.nombre || 'Método'} ({m.referencia})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
            <span className="text-indigo-800 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Cuota Congelada
            </span>
            <span className="text-sm font-extrabold text-indigo-700">{cuota.toFixed(2)}x</span>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Monto a Apostar ($)</label>
            <input type="number" min="10" step="5" value={monto} onChange={(e) => setMonto(Number(e.target.value))} required className="w-full border rounded-lg p-2" />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between font-medium">
            <span>Ganancia Estimada:</span>
            <span className="font-bold text-emerald-600">${gananciaEstimada}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button type="submit" disabled={loading || metodos.length === 0} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold disabled:opacity-50">
              {loading ? 'Procesando...' : 'Apostar Ahora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
