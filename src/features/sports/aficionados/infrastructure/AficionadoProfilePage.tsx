import React, { useState, useEffect } from 'react';
import { aficionadosService } from '../application/aficionadosService';
import { MetodoPagoAficionado, AficionadoEquipo } from '../domain/aficionadoModels';
import { MetodosPagoList } from './MetodosPagoList';
import { EquiposFavoritosList } from './EquiposFavoritosList';
import { stubsService } from '../../stubs/application/stubsService';
import { EquipoOption, MetodoPagoCatalogoOption } from '../../stubs/domain/stubModels';
import { UserCheck } from 'lucide-react';

export const AficionadoProfilePage: React.FC = () => {
  const [metodos, setMetodos] = useState<MetodoPagoAficionado[]>([]);
  const [equiposFavs, setEquiposFavs] = useState<AficionadoEquipo[]>([]);
  const [catalogoMetodos, setCatalogoMetodos] = useState<MetodoPagoCatalogoOption[]>([]);
  const [todosEquipos, setTodosEquipos] = useState<EquipoOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const aficionadoId = 1; // Aficionado de prueba activo

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, ef, cm, te] = await Promise.all([
        aficionadosService.getMetodosPago(aficionadoId),
        aficionadosService.getEquiposFavoritos(aficionadoId),
        stubsService.getMetodosPago(),
        stubsService.getEquipos(),
      ]);
      setMetodos(m);
      setEquiposFavs(ef);
      setCatalogoMetodos(cm);
      setTodosEquipos(te);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAgregarMetodo = async (idMetodoPago: number, referencia: string) => {
    await aficionadosService.asociarMetodoPago({ id_aficionado: aficionadoId, id_metodo_pago: idMetodoPago, referencia });
    await loadData();
  };

  const handleEliminarMetodo = async (id: number) => {
    await aficionadosService.eliminarMetodoPago(id);
    await loadData();
  };

  const handleVincularEquipo = async (equipoId: number) => {
    await aficionadosService.vincularEquipoFavorito({ id_aficionado: aficionadoId, id_equipo: equipoId });
    await loadData();
  };

  const handleDesvincularEquipo = async (equipoId: number) => {
    await aficionadosService.desvincularEquipoFavorito(aficionadoId, equipoId);
    await loadData();
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

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Cargando perfil de aficionado...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetodosPagoList
            metodos={metodos}
            catalogo={catalogoMetodos}
            onAgregar={handleAgregarMetodo}
            onEliminar={handleEliminarMetodo}
          />
          <EquiposFavoritosList
            equiposFavoritos={equiposFavs}
            todosEquipos={todosEquipos}
            onVincular={handleVincularEquipo}
            onDesvincular={handleDesvincularEquipo}
          />
        </div>
      )}
    </div>
  );
};
