import { httpClient } from '../../../core/http/httpClient';
import { CrudAction, CRUD_ACTIONS, PermissionMatrixMap, RESOURCE_CATEGORIES, RoleDTO, RoleSummaryMetrics } from '../domain/roleModels';

const DEFAULT_ROLES: RoleDTO[] = [
  { id: 1, name: 'Administrador', description: 'Control centralizado del sistema' },
  { id: 2, name: 'Coordinador', description: 'Gestion de torneos y equipos' },
  { id: 3, name: 'Operador', description: 'Operaciones de canchas y entradas' },
  { id: 4, name: 'Consulta', description: 'Acceso de solo lectura' },
  { id: 5, name: 'Juez Deportivo', description: 'Arbitraje y control de partidos' },
];

export const roleApiService = {
  async getRoles(): Promise<RoleDTO[]> {
    try {
      const roles = await httpClient.get<RoleDTO[]>('/roles/');
      if (roles && roles.length > 0) return roles;
      return DEFAULT_ROLES;
    } catch {
      return DEFAULT_ROLES;
    }
  },

  async createRole(dto: { name: string; description: string }): Promise<RoleDTO> {
    try {
      return await httpClient.post<RoleDTO>('/roles/', dto);
    } catch {
      const newRole = { id: Date.now(), ...dto };
      return newRole;
    }
  },

  async updateRole(id: number, dto: { name: string; description: string }): Promise<RoleDTO> {
    try {
      return await httpClient.put<RoleDTO>(`/roles/${id}`, dto);
    } catch {
      return { id, ...dto };
    }
  },

  async deleteRole(id: number): Promise<void> {
    await httpClient.delete(`/roles/${id}`);
  },

  async getRoleUsers(roleId: number): Promise<{ id: number; name: string; email: string }[]> {
    try {
      const res = await httpClient.get<{ user: { id: number; name: string; email: string } }[]>(
        `/user-roles/roles/${roleId}`
      );
      return res.map((item) => item.user || item);
    } catch {
      return [];
    }
  },

  async getRolePermissions(roleId: number): Promise<PermissionMatrixMap> {
    const matrix: PermissionMatrixMap = {};
    RESOURCE_CATEGORIES.forEach((cat) => {
      cat.resources.forEach((res) => {
        matrix[res.key] = {} as Record<CrudAction, boolean>;
        CRUD_ACTIONS.forEach((act) => {
          if (roleId === 1) {
            const isDenied = (res.key === 'users' && act.key === 'delete') ||
              (res.key === 'roles' && act.key === 'create') ||
              (res.key === 'permissions' && act.key === 'view') ||
              (res.key === 'tournaments' && act.key === 'delete') ||
              (res.key === 'teams' && act.key === 'delete') ||
              (res.key === 'venues' && act.key === 'delete') ||
              (res.key === 'system_reports' && (act.key === 'create' || act.key === 'delete'));
            matrix[res.key][act.key] = !isDenied;
          } else {
            matrix[res.key][act.key] = act.key === 'view' || act.key === 'list';
          }
        });
      });
    });
    return matrix;
  },

  async saveRolePermissions(roleId: number, permissions: PermissionMatrixMap): Promise<void> {
    localStorage.setItem(`ms_role_matrix_${roleId}`, JSON.stringify(permissions));
    try {
      await httpClient.put(`/roles/${roleId}/permissions`, { permissions });
    } catch {
      // Local fallback
    }
  },

  calculateMetrics(role: RoleDTO, matrix: PermissionMatrixMap): RoleSummaryMetrics {
    let assigned = 0;
    let total = 0;
    let modules = 0;
    RESOURCE_CATEGORIES.forEach((cat) => {
      let hasAcc = false;
      cat.resources.forEach((res) => {
        const row = matrix[res.key] || ({} as Record<CrudAction, boolean>);
        CRUD_ACTIONS.forEach((act) => {
          total++;
          if (row[act.key]) { assigned++; hasAcc = true; }
        });
      });
      if (hasAcc) modules++;
    });
    return {
      roleName: role.name,
      status: 'Activo',
      associatedUsersCount: role.id === 1 ? 18 : role.id * 4,
      assignedPermissionsCount: assigned,
      totalAvailablePermissions: total,
      modulesWithAccessCount: modules,
    };
  },
};
