import React, { useState, useEffect } from 'react';
import { Boleto, EmitirBoletoDto } from '../domain/boletoModels';
import { boletosService } from '../application/boletosService';
import { Partido } from '../../partidos/domain/partidoModels';
import { partidosService } from '../../partidos/application/partidosService';
import { EmitirBoletoModal } from './EmitirBoletoModal';
import { Ticket, Plus } from 'lucide-react';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';

export const BoletosPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [selectedPartidoId, setSelectedPartidoId] = useState<number>(0);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    partidosService
      .getPartidos()
      .then((res) => {
        setPartidos(res);
        if (res.length > 0) setSelectedPartidoId(res[0].id_partido);
      })
      .catch((err) => setError(toUserMessage(err)));
  }, []);

  const fetchBoletos = async (partidoId: number) => {
    if (!partidoId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await boletosService.getBoletosPorPartido(partidoId);
      setBoletos(data);
    } catch (err) {
      setBoletos([]);
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPartidoId) fetchBoletos(selectedPartidoId);
  }, [selectedPartidoId]);

  const handleEmitir = async (dto: EmitirBoletoDto) => {
    await boletosService.emitirBoleto(dto);
    if (selectedPartidoId) await fetchBoletos(selectedPartidoId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-600" /> Boletos y Localidades
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de boletería oficial por localidad de escenario y partido.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" /> Emitir Boleto
        </button>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border shadow-sm">
        <label className="text-xs font-semibold text-slate-700">Filtrar por Partido:</label>
        <select
          value={selectedPartidoId}
          onChange={(e) => setSelectedPartidoId(Number(e.target.value))}
          className="border rounded-lg p-2 text-xs font-medium flex-1 max-w-md"
        >
          {partidos.map((p) => {
            const l = p.partidoEquipos?.find((pe) => pe.rol === 'LOCAL')?.equipo?.nombre || 'Local';
            const v = p.partidoEquipos?.find((pe) => pe.rol === 'VISITANTE')?.equipo?.nombre || 'Visitante';
            return <option key={p.id_partido} value={p.id_partido}>Partido #{p.id_partido}: {l} vs {v}</option>;
          })}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando boletos...</div>
      ) : boletos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          No hay boletos emitidos para este partido.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boletos.map((b) => (
            <div key={b.id_boleto} className="bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {b.codigo}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {b.estado}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{b.localidad?.nombre || 'General'}</p>
              <div className="mt-3 flex items-center justify-between pt-3 border-t text-xs">
                <span className="text-slate-400">Precio</span>
                <span className="text-base font-extrabold text-indigo-600">${Number(b.precio).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmitirBoletoModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleEmitir} partidos={partidos} />
    </div>
  );
};
