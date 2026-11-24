import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Eye, Power, Trash2, Users } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { equiposService } from '../application/equiposService';
import { CreateEquipoDto, Equipo, EquipoFiltros, GENEROS_EQUIPO, GeneroEquipo } from '../domain/equipoModels';
import { EquipoFormModal } from './EquipoFormModal';
import { toUserMessage } from '../../shared/errorMessage';
import { useCrudList, useDebouncedValue } from '../../shared/useCrudList';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { IconButton } from '../../shared/ui/IconButton';
import { ModuleHeader } from '../../shared/ui/ModuleHeader';
import { Pagination } from '../../shared/ui/Pagination';
import { ActivoBadge } from '../../shared/ui/StatusBadge';
import { toDateInput } from '../../shared/pagination';

export const EquiposListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [genero, setGenero] = useState<GeneroEquipo | ''>('');
  const [estado, setEstado] = useState<'' | 'true' | 'false'>('');
  const debouncedSearch = useDebouncedValue(search);

  const filtros: EquipoFiltros = { nombre: debouncedSearch.trim(), genero, activo: estado };
  const { rows, total, page, setPage, size, loading, error, setError, reload } = useCrudList(
    (q) => equiposService.listar(filtros, q),
    JSON.stringify(filtros)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Equipo | null>(null);
  const [toDelete, setToDelete] = useState<Equipo | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (dto: CreateEquipoDto): Promise<void> => {
    if (toEdit) {
      await equiposService.actualizar(toEdit.id, dto);
      setNotice('Equipo actualizado correctamente.');
    } else {
      await equiposService.crear(dto);
      setNotice('Equipo registrado correctamente.');
    }
    setModalOpen(false);
    setToEdit(null);
    reload();
  };

  const handleToggle = async (e: Equipo): Promise<void> => {
    try {
      await equiposService.cambiarEstado(e.id, !(e.activo ?? true));
      setNotice(`Equipo ${e.activo === false ? 'activado' : 'desactivado'} correctamente.`);
      reload();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await equiposService.eliminar(toDelete.id);
      setNotice('Equipo eliminado correctamente.');
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
        icon={Users}
        title="Gestion de Equipos"
        subtitle="Organizaciones que participan en las competencias"
        count={total}
        countSingular="equipo"
        countPlural="equipos"
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre..."
        actionLabel="Nuevo Equipo"
        onAction={() => {
          setToEdit(null);
          setModalOpen(true);
        }}
      />

      <div className="flex items-center gap-2 text-xs">
        <select
          value={genero}
          onChange={(e) => setGenero(e.target.value as GeneroEquipo | '')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Todos los generos</option>
          {GENEROS_EQUIPO.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as '' | 'true' | 'false')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(e) => e.id}
        emptyIcon={Users}
        emptyTitle="No se encontraron equipos"
        columns={[
          {
            header: 'Equipo',
            cell: (e) => (
              <div>
                <p className="font-semibold text-slate-900">{e.nombre}</p>
                <p className="text-[11px] text-slate-400">ID: {e.id}</p>
              </div>
            ),
          },
          { header: 'Genero', cell: (e) => e.genero ?? <span className="text-slate-400 italic">Sin especificar</span> },
          { header: 'Creacion', cell: (e) => toDateInput(e.fechaCreacion) || '-' },
          { header: 'Estado', cell: (e) => <ActivoBadge activo={e.activo ?? true} /> },
        ]}
        actions={(e) => (
          <>
            <IconButton title="Ver detalle" icon={Eye} onClick={() => navigate(`/sports/equipos/${e.id}`)} />
            <IconButton
              title="Editar equipo"
              icon={Edit2}
              onClick={() => {
                setToEdit(e);
                setModalOpen(true);
              }}
            />
            <IconButton
              title={e.activo === false ? 'Activar equipo' : 'Desactivar equipo'}
              icon={Power}
              onClick={() => void handleToggle(e)}
            />
            <IconButton title="Eliminar equipo" icon={Trash2} tone="danger" onClick={() => setToDelete(e)} />
          </>
        )}
      />

      <Pagination page={page} size={size} total={total} onPageChange={setPage} />

      {modalOpen && (
        <EquipoFormModal
          equipoToEdit={toEdit}
          onClose={() => {
            setModalOpen(false);
            setToEdit(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar equipo"
        message={`Se eliminara el equipo "${toDelete?.nombre ?? ''}". Si tiene jugadores, deportes o inscripciones asociadas, el sistema no lo permitira.`}
        confirmLabel="Eliminar"
        isLoading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};
