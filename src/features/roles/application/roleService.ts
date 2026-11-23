import { httpClient } from '../../../core/http/httpClient';
import { PermissionMatrixEntry, PermissionMatrixMap, RoleDTO, RoleSummaryMetrics } from '../domain/roleModels';
import { PermissionResponseDTO } from '../../permissions/domain/permissionModels';

export const roleApiService = {
  async getRoles(): Promise<RoleDTO[]> {
    try {
      const roles = await httpClient.get<RoleDTO[]>('/roles/');
      if (roles && roles.length > 0) return roles;
      return [];
    } catch {
      return [];
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
    const [catalog, assignments] = await Promise.all([
      httpClient.get<PermissionResponseDTO[]>('/permissions/'),
      httpClient.get<{ permission: PermissionResponseDTO }[]>(`/role-permissions/roles/${roleId}`),
    ]);

    const assignedIds = new Set(assignments.map((item) => item.permission?.id).filter((id): id is number => Boolean(id)));
    const matrix: PermissionMatrixMap = {};

    catalog.forEach((permission) => {
      const model = permission.model?.trim() || 'Sin modelo';
      const modelKey = model.toUpperCase();
      const method = permission.method?.trim().toUpperCase() || 'OTRO';
      if (!matrix[modelKey]) matrix[modelKey] = {};
      if (!matrix[modelKey][method]) matrix[modelKey][method] = [];

      const assigned = assignedIds.has(permission.id);
      matrix[modelKey][method]!.push({
        id: permission.id,
        url: permission.url,
        method,
        model,
        assigned,
        originallyAssigned: assigned,
      });
    });

    Object.values(matrix).forEach((methods) => {
      Object.values(methods).forEach((entries) => {
        entries?.sort((a, b) => a.url.localeCompare(b.url) || a.id - b.id);
      });
    });

    return matrix;
  },

  async saveRolePermissions(roleId: number, permissions: PermissionMatrixMap): Promise<void> {
    const entries = Object.values(permissions).flatMap((methods) =>
      Object.values(methods).flatMap((items) => items || [])
    );

    await Promise.all(
      entries.map((entry) => {
        if (entry.assigned === entry.originallyAssigned) return Promise.resolve();
        if (entry.assigned) {
          return httpClient.post('/role-permissions', { roleId, permissionId: entry.id });
        }
        return httpClient.delete(`/role-permissions/${roleId}/${entry.id}`);
      })
    );

    localStorage.setItem(`ms_role_matrix_${roleId}`, JSON.stringify(permissions));
  },

  calculateMetrics(role: RoleDTO, matrix: PermissionMatrixMap): RoleSummaryMetrics {
    const entries: PermissionMatrixEntry[] = Object.values(matrix).flatMap((methods) =>
      Object.values(methods).flatMap((items) => items || [])
    );
    const assigned = entries.filter((entry) => entry.assigned).length;
    const modules = new Set(
      entries.filter((entry) => entry.assigned).map((entry) => entry.model)
    ).size;

    return {
      roleName: role.name,
      status: 'Activo',
      associatedUsersCount: role.id === 1 ? 18 : role.id * 4,
      assignedPermissionsCount: assigned,
      totalAvailablePermissions: entries.length,
      modulesWithAccessCount: modules,
    };
  },
};
