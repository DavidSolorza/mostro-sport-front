import { BadgeTone } from '../../shared/ui/StatusBadge';
import { EstadoTorneo } from '../domain/torneoModels';

export const ESTADO_TORNEO_TONE: Record<EstadoTorneo, BadgeTone> = {
  INSCRIPCIONES_ABIERTAS: 'amber',
  EN_CURSO: 'emerald',
  FINALIZADO: 'slate',
  CANCELADO: 'rose',
};
