import React, { useState, useEffect } from 'react';
import { Partido, EstadoPartido, CreatePartidoDto, RegistrarAnotacionDto, FinalizarPartidoDto } from '../domain/partidoModels';
import { partidosService } from '../application/partidosService';
import { PartidoCard } from './PartidoCard';
import { CrearPartidoModal } from './CrearPartidoModal';
import { RegistrarAnotacionModal } from './RegistrarAnotacionModal';
import { FinalizarPartidoModal } from './FinalizarPartidoModal';
import { Plus, Trophy, RefreshCw } from 'lucide-react';

export const PartidosListPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [showCrearModal, setShowCrearModal] = useState<boolean>(false);
  const [selectedPartidoAnotar, setSelectedPartidoAnotar] = useState<Partido | null>(null);
  const [selectedPartidoFinalizar, setSelectedPartidoFinalizar] = useState<Partido | null>(null);

  const fetchPartidos = async () => {
    setLoading(true);
    try {
      const data = await partidosService.getPartidos();
      setPartidos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartidos();
  }, []);

  const handleCambiarEstado = async (id: number, estado: EstadoPartido) => {
    await partidosService.cambiarEstado(id, estado);
    await fetchPartidos();
  };

  const handleCrearPartido = async (dto: CreatePartidoDto) => {
    await partidosService.crearPartido(dto);
    await fetchPartidos();
  };

  const handleRegistrarAnotacion = async (dto: RegistrarAnotacionDto) => {
    await partidosService.registrarAnotacion(dto);
    await fetchPartidos();
  };

  const handleFinalizarPartido = async (id: number, dto: FinalizarPartidoDto) => {
    await partidosService.finalizarPartido(id, dto);
    await fetchPartidos();
  };

  const filtrados = partidos.filter((p) => {
    if (filtroEstado === 'TODOS') return true;
    return p.estado === filtroEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" /> Gestión de Partidos (HU-GC-06 / 07)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Programación de encuentros, marcadores en vivo y liquidación.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPartidos} className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCrearModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Programar Partido
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
        {['TODOS', 'PROGRAMADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO'].map((st) => (
          <button
            key={st}
            onClick={() => setFiltroEstado(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filtroEstado === st ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando partidos...</div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-400 text-xs">
          No hay partidos en estado {filtroEstado}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((p) => (
            <PartidoCard
              key={p.id_partido}
              partido={p}
              onCambiarEstado={handleCambiarEstado}
              onOpenAnotacion={setSelectedPartidoAnotar}
              onOpenFinalizar={setSelectedPartidoFinalizar}
            />
          ))}
        </div>
      )}

      <CrearPartidoModal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} onSubmit={handleCrearPartido} />
      <RegistrarAnotacionModal partido={selectedPartidoAnotar} onClose={() => setSelectedPartidoAnotar(null)} onSubmit={handleRegistrarAnotacion} />
      <FinalizarPartidoModal partido={selectedPartidoFinalizar} onClose={() => setSelectedPartidoFinalizar(null)} onSubmit={handleFinalizarPartido} />
    </div>
  );
};
