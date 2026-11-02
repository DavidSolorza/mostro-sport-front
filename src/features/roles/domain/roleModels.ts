export type CrudAction = 'view' | 'list' | 'create' | 'update' | 'delete';

export const CRUD_ACTIONS: { key: CrudAction; label: string }[] = [
  { key: 'view', label: 'Ver' },
  { key: 'list', label: 'Listar' },
  { key: 'create', label: 'Crear' },
  { key: 'update', label: 'Actualizar' },
  { key: 'delete', label: 'Eliminar' },
];

export interface ResourceItem {
  key: string;
  label: string;
  iconName: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  resources: ResourceItem[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'admin',
    name: 'Administracion',
    resources: [
      { key: 'users', label: 'Usuarios', iconName: 'Users' },
      { key: 'roles', label: 'Roles', iconName: 'KeyRound' },
      { key: 'permissions', label: 'Permisos', iconName: 'Lock' },
    ],
  },
  {
    id: 'sports',
    name: 'Gestion Deportiva',
    resources: [
      { key: 'tournaments', label: 'Torneos', iconName: 'Trophy' },
      { key: 'teams', label: 'Equipos', iconName: 'Shield' },
      { key: 'players', label: 'Jugadores', iconName: 'User' },
      { key: 'matches', label: 'Partidos', iconName: 'Calendar' },
    ],
  },
  {
    id: 'commercial',
    name: 'Comercial',
    resources: [{ key: 'tickets', label: 'Entradas', iconName: 'Ticket' }],
  },
  {
    id: 'infra',
    name: 'Infraestructura',
    resources: [{ key: 'venues', label: 'Escenarios', iconName: 'MapPin' }],
  },
  {
    id: 'reports',
    name: 'Reportes',
    resources: [{ key: 'system_reports', label: 'Reportes', iconName: 'BarChart3' }],
  },
];

export interface RoleDTO {
  id: number;
  name: string;
  description: string;
}

export type PermissionMatrixMap = Record<string, Record<CrudAction, boolean>>;

export interface RoleSummaryMetrics {
  roleName: string;
  status: string;
  associatedUsersCount: number;
  assignedPermissionsCount: number;
  totalAvailablePermissions: number;
  modulesWithAccessCount: number;
}
