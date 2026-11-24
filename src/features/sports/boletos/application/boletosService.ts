import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { asArray, Page } from '../../shared/pagination';
import { Boleto, Localidad, EmitirBoletoDto, EstadoBoleto } from '../domain/boletoModels';

interface LocalidadRaw extends Partial<Localidad> {
  id?: number;
  escenarioId?: number;
}

interface BoletoRaw extends Partial<Omit<Boleto, 'localidad'>> {
  id?: number;
  partidoId?: number;
  localidadId?: number;
  aficionadoId?: number | null;
  localidad?: LocalidadRaw;
}

export function normalizarLocalidad(raw: LocalidadRaw): Localidad {
  return {
    id_localidad: Number(raw.id_localidad ?? raw.id ?? 0),
    nombre: raw.nombre ?? '',
    capacidad: Number(raw.capacidad ?? 0),
    id_escenario: Number(raw.id_escenario ?? raw.escenarioId ?? 0),
  };
}

export function normalizarBoleto(raw: BoletoRaw): Boleto {
  return {
    id_boleto: Number(raw.id_boleto ?? raw.id ?? 0),
    codigo: raw.codigo ?? '',
    precio: Number(raw.precio ?? 0),
    estado: (raw.estado ?? 'DISPONIBLE') as EstadoBoleto,
    id_partido: Number(raw.id_partido ?? raw.partidoId ?? 0),
    id_localidad: Number(raw.id_localidad ?? raw.localidadId ?? raw.localidad?.id ?? 0),
    id_aficionado: raw.id_aficionado ?? raw.aficionadoId ?? null,
    localidad: raw.localidad ? normalizarLocalidad(raw.localidad) : undefined,
    partido: raw.partido,
  };
}

export const boletosService = {
  async getBoletosPorPartido(partidoId: number): Promise<Boleto[]> {
    const res = await sportsHttpClient.get<BoletoRaw[] | Page<BoletoRaw>>(`/partidos/${partidoId}/boletos`);
    return asArray(res).map(normalizarBoleto);
  },

  async emitirBoleto(dto: EmitirBoletoDto): Promise<Boleto> {
    const partidoId = dto.partidoId ?? dto.id_partido;
    const localidadId = dto.localidadId ?? dto.id_localidad;
    const aficionadoId = dto.aficionadoId ?? dto.id_aficionado;
    const payload = {
      codigo: dto.codigo,
      precio: dto.precio,
      estado: dto.estado,
      partidoId,
      localidadId,
      ...(aficionadoId ? { aficionadoId } : {}),
    };
    return normalizarBoleto(await sportsHttpClient.post<BoletoRaw>('/boletos', payload));
  },

  async cambiarEstadoBoleto(id: number, estado: EstadoBoleto): Promise<Boleto> {
    return normalizarBoleto(await sportsHttpClient.patch<BoletoRaw>(`/boletos/${id}/estado`, { estado }));
  },

  async getLocalidadesPorEscenario(escenarioId: number): Promise<Localidad[]> {
    const res = await sportsHttpClient.get<LocalidadRaw[] | Page<LocalidadRaw>>(
      `/escenarios/${escenarioId}/localidades`
    );
    return asArray(res).map(normalizarLocalidad);
  },

  async crearLocalidad(dto: { nombre: string; capacidad: number; id_escenario: number }): Promise<Localidad> {
    const res = await sportsHttpClient.post<LocalidadRaw>('/localidades', {
      nombre: dto.nombre,
      capacidad: dto.capacidad,
      escenarioId: dto.id_escenario,
    });
    return normalizarLocalidad(res);
  },
};
