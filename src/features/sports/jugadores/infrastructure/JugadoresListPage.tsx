import React, { useState } from 'react';
import { Edit2, Eye, Power, Trash2, UserRound } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { jugadoresService } from '../application/jugadoresService';
import { CreateJugadorDto, Jugador, JugadorFiltros } from '../domain/jugadorModels';
import { JugadorFormModal } from './JugadorFormModal';
import { JugadorPerfilModal } from './JugadorPerfilModal';
import { toDateInput } from '../../shared/pagination';
import { toUserMessage } from '../../shared/errorMessage';
import { useCrudList, useDebouncedValue } from '../../shared/useCrudList';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { IconButton } from '../../shared/ui/IconButton';
import { ModuleHeader } from '../../shared/ui/ModuleHeader';
import { Pagination } from '../../shared/ui/Pagination';
import { ActivoBadge } from '../../shared/ui/StatusBadge';

export const JugadoresListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [documento, setDocumento] = useState('');
  const [estado, setEstado] = useState<'' | 'true' | 'false'>('');
  const debouncedSearch = useDebouncedValue(search);
  const debouncedDoc = useDebouncedValue(documento);

  const filtros: JugadorFiltros = { nombre: debouncedSearch.trim(), documento: debouncedDoc.trim(), activo: estado };
  const { rows, total, page, setPage, size, loading, error, setError, reload } = useCrudList(
    (q) => jugadoresService.listar(filtros, q),
    JSON.stringify(filtros)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Jugador | null>(null);
  const [toView, setToView] = useState<Jugador | null>(null);
  const [toDelete, setToDelete] = useState<Jugador | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (dto: CreateJugadorDto): Promise<void> => {
    if (toEdit) {
      await jugadoresService.actualizar(toEdit.id, dto);
      setNotice('Jugador actualizado correctamente.');
    } else {
      await jugadoresService.crear(dto);
      setNotice('Jugador registrado correctamente.');
    }
    setModalOpen(false);
    setToEdit(null);
    reload();
  };

  const handleToggle = async (j: Jugador): Promise<void> => {
    try {
      await jugadoresService.cambiarEstado(j.id, !(j.activo ?? true));
      setNotice(`Jugador ${j.activo === false ? 'activado' : 'desactivado'} correctamente.`);
      reload();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await jugadoresService.eliminar(toDelete.id);
      setNotice('Jugador eliminado correctamente.');
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
        icon={UserRound}
        title="Gestion de Jugadores"
        subtitle="Registro de las personas que integran los equipos"
        count={total}
        countSingular="jugador"
        countPlural="jugadores"
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre..."
        actionLabel="Nuevo Jugador"
        onAction={() => {
          setToEdit(null);
          setModalOpen(true);
        }}
      />

      <div className="flex items-center gap-2 text-xs">
        <input
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="Filtrar por documento..."
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        />
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
        rowKey={(j) => j.id}
        emptyIcon={UserRound}
        emptyTitle="No se encontraron jugadores"
        columns={[
          {
            header: 'Jugador',
            cell: (j) => (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                  {j.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{`${j.nombre} ${j.apellido ?? ''}`.trim()}</p>
                  <p className="text-[11px] text-slate-400">ID: {j.id}</p>
                </div>
              </div>
            ),
          },
          { header: 'Documento', cell: (j) => <span className="font-mono text-slate-600">{j.documento}</span> },
          { header: 'Nacimiento', cell: (j) => toDateInput(j.fechaNacimiento) || '-' },
          { header: 'Posicion', cell: (j) => j.posicion?.nombre ?? <span className="text-slate-400 italic">Sin posicion</span> },
          { header: 'Estado', cell: (j) => <ActivoBadge activo={j.activo ?? true} /> },
        ]}
        actions={(j) => (
          <>
            <IconButton title="Ver perfil deportivo" icon={Eye} onClick={() => setToView(j)} />
            <IconButton
              title="Editar jugador"
              icon={Edit2}
              onClick={() => {
                setToEdit(j);
                setModalOpen(true);
              }}
            />
            <IconButton
              title={j.activo === false ? 'Activar jugador' : 'Desactivar jugador'}
              icon={Power}
              onClick={() => void handleToggle(j)}
            />
            <IconButton title="Eliminar jugador" icon={Trash2} tone="danger" onClick={() => setToDelete(j)} />
          </>
        )}
      />

      <Pagination page={page} size={size} total={total} onPageChange={setPage} />

      {modalOpen && (
        <JugadorFormModal
          jugadorToEdit={toEdit}
          onClose={() => {
            setModalOpen(false);
            setToEdit(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {toView && <JugadorPerfilModal jugador={toView} onClose={() => setToView(null)} />}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar jugador"
        message={`Se eliminara a "${toDelete?.nombre ?? ''}". Si pertenece a equipos o tiene anotaciones asociadas, el sistema no lo permitira.`}
        confirmLabel="Eliminar"
        isLoading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};
