import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Repeat, Trash2, Trophy } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { torneosService } from '../application/torneosService';
import { deportesService } from '../../deportes/application/deportesService';
import { Deporte } from '../../deportes/domain/deporteModels';
import { CreateTorneoDto, ESTADOS_TORNEO, ESTADO_TORNEO_LABEL, EstadoTorneo, Torneo, TorneoFiltros } from '../domain/torneoModels';
import { TorneoFormModal } from './TorneoFormModal';
import { CambiarEstadoTorneoModal } from './CambiarEstadoTorneoModal';
import { ESTADO_TORNEO_TONE } from './torneoBadges';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { useCrudList, useDebouncedValue } from '../../shared/useCrudList';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { IconButton } from '../../shared/ui/IconButton';
import { ModuleHeader } from '../../shared/ui/ModuleHeader';
import { Pagination } from '../../shared/ui/Pagination';
import { StatusBadge } from '../../shared/ui/StatusBadge';

export const TorneosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<EstadoTorneo | ''>('');
  const [deporteId, setDeporteId] = useState<number | ''>('');
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const debouncedSearch = useDebouncedValue(search);

  const filtros: TorneoFiltros = { nombre: debouncedSearch.trim(), estado, deporteId };
  const { rows, total, page, setPage, size, loading, error, setError, reload } = useCrudList(
    (q) => torneosService.listar(filtros, q),
    JSON.stringify(filtros)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Torneo | null>(null);
  const [toChangeState, setToChangeState] = useState<Torneo | null>(null);
  const [toDelete, setToDelete] = useState<Torneo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    deportesService
      .listarActivos()
      .then(setDeportes)
      .catch(() => setDeportes([]));
  }, []);

  const handleSubmit = async (dto: CreateTorneoDto): Promise<void> => {
    if (toEdit) {
      await torneosService.actualizar(toEdit.id, dto);
      setNotice('Torneo actualizado correctamente.');
    } else {
      await torneosService.crear(dto);
      setNotice('Torneo registrado correctamente.');
    }
    setModalOpen(false);
    setToEdit(null);
    reload();
  };

  const handleChangeState = async (nuevo: EstadoTorneo): Promise<void> => {
    if (!toChangeState) return;
    await torneosService.cambiarEstado(toChangeState.id, nuevo);
    setNotice('Estado del torneo actualizado correctamente.');
    setToChangeState(null);
    reload();
  };

  const confirmDelete = async (): Promise<void> => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await torneosService.eliminar(toDelete.id);
      setNotice('Torneo eliminado correctamente.');
      reload();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <ModuleHeader
        icon={Trophy}
        title="Gestion de Torneos"
        subtitle="Competencias organizadas por deporte"
        count={total}
        countSingular="torneo"
        countPlural="torneos"
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre..."
        actionLabel="Nuevo Torneo"
        onAction={() => {
          setToEdit(null);
          setModalOpen(true);
        }}
      />

      <div className="flex items-center gap-2 text-xs">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoTorneo | '')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_TORNEO.map((s) => (
            <option key={s} value={s}>
              {ESTADO_TORNEO_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={deporteId}
          onChange={(e) => setDeporteId(e.target.value ? Number(e.target.value) : '')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Todos los deportes</option>
          {deportes.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(t) => t.id}
        emptyIcon={Trophy}
        emptyTitle="No se encontraron torneos"
        columns={[
          {
            header: 'Torneo',
            cell: (t) => (
              <div>
                <p className="font-semibold text-slate-900">{t.nombre}</p>
                <p className="text-[11px] text-slate-400">ID: {t.id}</p>
              </div>
            ),
          },
          { header: 'Deporte', cell: (t) => t.deporte?.nombre ?? (t.deporteId ? `#${t.deporteId}` : '-') },
          { header: 'Inicio', cell: (t) => toDateInput(t.fechaInicio) },
          { header: 'Fin', cell: (t) => toDateInput(t.fechaFin) },
          {
            header: 'Estado',
            cell: (t) => <StatusBadge tone={ESTADO_TORNEO_TONE[t.estado] ?? 'slate'} label={ESTADO_TORNEO_LABEL[t.estado] ?? t.estado} />,
          },
        ]}
        actions={(t) => (
          <>
            <IconButton title="Gestionar torneo" icon={Eye} onClick={() => navigate(`/sports/torneos/${t.id}`)} />
            <IconButton
              title="Editar torneo"
              icon={Edit2}
              onClick={() => {
                setToEdit(t);
                setModalOpen(true);
              }}
            />
            <IconButton title="Cambiar estado" icon={Repeat} onClick={() => setToChangeState(t)} />
            <IconButton title="Eliminar torneo" icon={Trash2} tone="danger" onClick={() => setToDelete(t)} />
          </>
        )}
      />

      <Pagination page={page} size={size} total={total} onPageChange={setPage} />

      {modalOpen && (
        <TorneoFormModal
          torneoToEdit={toEdit}
          onClose={() => {
            setModalOpen(false);
            setToEdit(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {toChangeState && (
        <CambiarEstadoTorneoModal torneo={toChangeState} onClose={() => setToChangeState(null)} onSubmit={handleChangeState} />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar torneo"
        message={`Se eliminara el torneo "${toDelete?.nombre ?? ''}". Si tiene fases o partidos asociados, el sistema no lo permitira.`}
        confirmLabel="Eliminar"
        isLoading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};
