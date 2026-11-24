import React, { useState, useEffect } from 'react';
import { aficionadosService } from '../application/aficionadosService';
import { MetodoPagoAficionado, AficionadoEquipo } from '../domain/aficionadoModels';
import { MetodosPagoList } from './MetodosPagoList';
import { EquiposFavoritosList } from './EquiposFavoritosList';
import { equiposService } from '../../equipos/application/equiposService';
import { stubsService } from '../../stubs/application/stubsService';
import { EquipoOption, MetodoPagoCatalogoOption } from '../../stubs/domain/stubModels';
import { toUserMessage } from '../../shared/errorMessage';
import { ErrorBanner } from '../../shared/ui/ErrorBanner';
import { UserCheck } from 'lucide-react';

export const AficionadoProfilePage: React.FC = () => {
  const [metodos, setMetodos] = useState<MetodoPagoAficionado[]>([]);
  const [equiposFavs, setEquiposFavs] = useState<AficionadoEquipo[]>([]);
  const [catalogoMetodos, setCatalogoMetodos] = useState<MetodoPagoCatalogoOption[]>([]);
  const [todosEquipos, setTodosEquipos] = useState<EquipoOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const aficionadoId = 1;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, ef, cm, equiposActivos] = await Promise.all([
        aficionadosService.getMetodosPago(aficionadoId),
        aficionadosService.getEquiposFavoritos(aficionadoId),
        stubsService.getMetodosPago(),
        equiposService.listarActivos(),
      ]);
      setMetodos(m);
      setEquiposFavs(ef);
      setCatalogoMetodos(cm);
      setTodosEquipos(equiposActivos.map((eq) => ({ id_equipo: eq.id, nombre: eq.nombre })));
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const ejecutar = async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
      await loadData();
    } catch (err) {
      setError(toUserMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" /> Perfil del Aficionado (HU-GC-10)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Gestión de billetera, métodos de pago autorizados y seguimiento de equipos favoritos.
        </p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando perfil de aficionado...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetodosPagoList
            metodos={metodos}
            catalogo={catalogoMetodos}
            onAgregar={(idMetodoPago, referencia) =>
              ejecutar(() => aficionadosService.asociarMetodoPago({ id_aficionado: aficionadoId, id_metodo_pago: idMetodoPago, referencia }).then(() => undefined))
            }
            onEliminar={(id) => ejecutar(() => aficionadosService.eliminarMetodoPago(id))}
          />
          <EquiposFavoritosList
            equiposFavoritos={equiposFavs}
            todosEquipos={todosEquipos}
            onVincular={(equipoId) =>
              ejecutar(() => aficionadosService.vincularEquipoFavorito({ id_aficionado: aficionadoId, id_equipo: equipoId }).then(() => undefined))
            }
            onDesvincular={(equipoId) => ejecutar(() => aficionadosService.desvincularEquipoFavorito(aficionadoId, equipoId))}
          />
        </div>
      )}
    </div>
  );
};
