import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Edit2, Eye, Power, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../../../../core/layout/ConfirmDialog';
import { escenariosService } from '../application/escenariosService';
import { Escenario, EscenarioFiltros } from '../domain/escenarioModels';
import { EscenarioFormModal, EscenarioFormValues } from './EscenarioFormModal';
import { toUserMessage } from '../../shared/errorMessage';
import { useCrudList, useDebouncedValue } from '../../shared/useCrudList';
import { DataTable } from '../../shared/ui/DataTable';
import { ErrorBanner, SuccessBanner } from '../../shared/ui/ErrorBanner';
import { IconButton } from '../../shared/ui/IconButton';
import { ModuleHeader } from '../../shared/ui/ModuleHeader';
import { Pagination } from '../../shared/ui/Pagination';
import { ActivoBadge } from '../../shared/ui/StatusBadge';

export const EscenariosListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<'' | 'true' | 'false'>('');
  const [soloRaiz, setSoloRaiz] = useState(false);
  const debouncedSearch = useDebouncedValue(search);

  const filtros: EscenarioFiltros = { nombre: debouncedSearch.trim(), activo: estado, soloRaiz: soloRaiz ? true : '' };
  const { rows, total, page, setPage, size, loading, error, setError, reload } = useCrudList(
    (q) => escenariosService.listar(filtros, q),
    JSON.stringify(filtros)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [toEdit, setToEdit] = useState<Escenario | null>(null);
  const [toDelete, setToDelete] = useState<Escenario | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (values: EscenarioFormValues): Promise<void> => {
    if (toEdit) {
      await escenariosService.actualizar(toEdit.id, values);
      setNotice('Escenario actualizado correctamente.');
    } else {
      await escenariosService.crear(values);
      setNotice('Escenario registrado correctamente.');
    }
    setModalOpen(false);
    setToEdit(null);
    reload();
  };

  const handleToggle = async (e: Escenario): Promise<void> => {
    try {
      await escenariosService.cambiarEstado(e.id, !(e.activo ?? true));
      setNotice(`Escenario ${e.activo === false ? 'activado' : 'desactivado'} correctamente.`);
      reload();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await escenariosService.eliminar(toDelete.id);
      setNotice('Escenario eliminado correctamente.');
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
        icon={Building2}
        title="Gestion de Escenarios"
        subtitle="Complejos deportivos y sus subescenarios"
        count={total}
        countSingular="escenario"
        countPlural="escenarios"
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre..."
        actionLabel="Nuevo Escenario"
        onAction={() => {
          setToEdit(null);
          setModalOpen(true);
        }}
      />

      <div className="flex items-center gap-3 text-xs">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as '' | 'true' | 'false')}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:border-indigo-600 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <label className="flex items-center gap-1.5 text-slate-600">
          <input type="checkbox" checked={soloRaiz} onChange={(e) => setSoloRaiz(e.target.checked)} />
          Solo complejos (sin subescenarios)
        </label>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SuccessBanner message={notice} onClose={() => setNotice(null)} />

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(e) => e.id}
        emptyIcon={Building2}
        emptyTitle="No se encontraron escenarios"
        columns={[
          {
            header: 'Escenario',
            cell: (e) => (
              <div>
                <p className="font-semibold text-slate-900">{e.nombre}</p>
                <p className="text-[11px] text-slate-400">ID: {e.id}</p>
              </div>
            ),
          },
          { header: 'Direccion', cell: (e) => e.direccion || <span className="text-slate-400 italic">Sin direccion</span> },
          {
            header: 'Tipo',
            cell: (e) => (e.escenarioPadreId ? `Subescenario de #${e.escenarioPadreId}` : 'Complejo'),
          },
          { header: 'Estado', cell: (e) => <ActivoBadge activo={e.activo ?? true} /> },
        ]}
        actions={(e) => (
          <>
            <IconButton title="Ver subescenarios" icon={Eye} onClick={() => navigate(`/sports/escenarios/${e.id}`)} />
            <IconButton
              title="Editar escenario"
              icon={Edit2}
              onClick={() => {
                setToEdit(e);
                setModalOpen(true);
              }}
            />
            <IconButton
              title={e.activo === false ? 'Activar escenario' : 'Desactivar escenario'}
              icon={Power}
              onClick={() => void handleToggle(e)}
            />
            <IconButton title="Eliminar escenario" icon={Trash2} tone="danger" onClick={() => setToDelete(e)} />
          </>
        )}
      />

      <Pagination page={page} size={size} total={total} onPageChange={setPage} />

      {modalOpen && (
        <EscenarioFormModal
          title={toEdit ? 'Editar Escenario' : 'Registrar Nuevo Escenario'}
          submitLabel={toEdit ? 'Actualizar' : 'Crear Escenario'}
          escenarioToEdit={toEdit}
          onClose={() => {
            setModalOpen(false);
            setToEdit(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar escenario"
        message={`Se eliminara el escenario "${toDelete?.nombre ?? ''}". Si tiene subescenarios, localidades, partidos o torneos asociados, el sistema no lo permitira.`}
        confirmLabel="Eliminar"
        isLoading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};
