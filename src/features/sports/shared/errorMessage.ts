import { HttpError } from '../../../core/errors/HttpError';

export const toUserMessage = (err: unknown): string => {
  if (err instanceof HttpError) {
    if (err.status === 403) {
      return 'No tiene permiso para realizar esta accion. Solicitelo al administrador de seguridad.';
    }
    if (err.status === 404) {
      return err.message || 'El registro solicitado ya no existe.';
    }
    return err.message;
  }
  return 'No se pudo conectar con el servicio de negocio.';
};

export const isNotFound = (err: unknown): boolean => err instanceof HttpError && err.status === 404;
