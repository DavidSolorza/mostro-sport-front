import { sportsHttpClient } from '../../../../core/http/sportsHttpClient';
import { Boleto, Localidad, EmitirBoletoDto, EstadoBoleto } from '../domain/boletoModels';

export const boletosService = {
  async getBoletosPorPartido(partidoId: number): Promise<Boleto[]> {
    return sportsHttpClient.get<Boleto[]>(`/boletos/partido/${partidoId}`);
  },

  async emitirBoleto(dto: EmitirBoletoDto): Promise<Boleto> {
    return sportsHttpClient.post<Boleto>('/boletos', dto);
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
