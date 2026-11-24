import React, { useState, useEffect, useCallback } from 'react';
import { Partido, EstadoPartido, CreatePartidoDto, RegistrarAnotacionDto, FinalizarPartidoDto } from '../domain/partidoModels';
import { partidosService } from '../application/partidosService';
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from '../../shared/pagination';
import { Pagination } from '../../shared/ui/Pagination';
import { PartidoCard } from './PartidoCard';
import { CrearPartidoModal } from './CrearPartidoModal';
import { RegistrarAnotacionModal } from './RegistrarAnotacionModal';
import { FinalizarPartidoModal } from './FinalizarPartidoModal';
import { Plus, Trophy, RefreshCw } from 'lucide-react';

export const PartidosListPage: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(FIRST_PAGE);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [showCrearModal, setShowCrearModal] = useState<boolean>(false);
  const [selectedAnotar, setSelectedAnotar] = useState<Partido | null>(null);
  const [selectedFinalizar, setSelectedFinalizar] = useState<Partido | null>(null);

  const fetchPartidos = useCallback(async (targetPage = page) => {
    setLoading(true);
    try {
      const res = await partidosService.getPartidosPage({ page: targetPage, size: DEFAULT_PAGE_SIZE });
      setPartidos(res.content);
      setTotal(res.totalElements);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPartidos(page); }, [page, fetchPartidos]);

  const handleCambiarEstado = async (id: number, estado: EstadoPartido) => {
    await partidosService.cambiarEstado(id, estado);
    await fetchPartidos(page);
  };

  const handleCrear = async (dto: CreatePartidoDto) => {
    await partidosService.crearPartido(dto);
    setPage(FIRST_PAGE);
    await fetchPartidos(FIRST_PAGE);
  };

  const handleAnotar = async (dto: RegistrarAnotacionDto) => {
    await partidosService.registrarAnotacion(dto);
    await fetchPartidos(page);
  };

  const handleFinalizar = async (id: number, dto: FinalizarPartidoDto) => {
    await partidosService.finalizarPartido(id, dto);
    await fetchPartidos(page);
  };

  const filtrados = partidos.filter((p) => filtroEstado === 'TODOS' || p.estado === filtroEstado);

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
          <button onClick={() => fetchPartidos(page)} className="p-2 border rounded-lg hover:bg-slate-50 text-slate-600">
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

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-medium">
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((p) => (
              <PartidoCard
                key={p.id_partido}
                partido={p}
                onCambiarEstado={handleCambiarEstado}
                onOpenAnotacion={setSelectedAnotar}
                onOpenFinalizar={setSelectedFinalizar}
              />
            ))}
          </div>
          <Pagination page={page} size={DEFAULT_PAGE_SIZE} total={total} onPageChange={setPage} />
        </div>
      )}

      <CrearPartidoModal isOpen={showCrearModal} onClose={() => setShowCrearModal(false)} onSubmit={handleCrear} />
      <RegistrarAnotacionModal onClose={() => setSelectedAnotar(null)} partido={selectedAnotar} onSubmit={handleAnotar} />
      <FinalizarPartidoModal onClose={() => setSelectedFinalizar(null)} partido={selectedFinalizar} onSubmit={handleFinalizar} />
    </div>
  );
};
