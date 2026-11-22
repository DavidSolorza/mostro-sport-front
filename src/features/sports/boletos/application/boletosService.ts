import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { Boleto, Localidad, EmitirBoletoDto, EstadoBoleto } from '../domain/boletoModels';

export const boletosService = {
  async getBoletosPorPartido(partidoId: number): Promise<Boleto[]> {
    return sportsHttpClient.get<Boleto[]>(`/boletos/partido/${partidoId}`);
  },

  async emitirBoleto(dto: EmitirBoletoDto): Promise<Boleto> {
    const payload = {
      ...dto,
      partidoId: dto.partidoId ?? dto.id_partido,
      id_partido: dto.id_partido ?? dto.partidoId,
      localidadId: dto.localidadId ?? dto.id_localidad,
      id_localidad: dto.id_localidad ?? dto.localidadId,
      aficionadoId: dto.aficionadoId ?? dto.id_aficionado,
      id_aficionado: dto.id_aficionado ?? dto.aficionadoId,
    };
    return sportsHttpClient.post<Boleto>('/boletos', payload);
  },

  async cambiarEstadoBoleto(id: number, estado: EstadoBoleto): Promise<Boleto> {
    return sportsHttpClient.patch<Boleto>(`/boletos/${id}/estado`, { estado });
  },

  async getLocalidadesPorEscenario(escenarioId: number): Promise<Localidad[]> {
    return sportsHttpClient.get<Localidad[]>(`/localidades/escenario/${escenarioId}`);
  },

  async crearLocalidad(dto: { nombre: string; capacidad: number; id_escenario: number }): Promise<Localidad> {
    return sportsHttpClient.post<Localidad>('/localidades', dto);
  },
};
