import { httpClient } from '../../../core/http/httpClient';
import { CreatePermissionDTO, PermissionResponseDTO, UpdatePermissionDTO } from '../domain/permissionModels';

const DEFAULT_PERMISSIONS: PermissionResponseDTO[] = [
  { id: 1, method: 'GET', url: '/api/users', model: 'Users' },
  { id: 2, method: 'POST', url: '/api/users', model: 'Users' },
  { id: 3, method: 'PUT', url: '/api/users/{id}', model: 'Users' },
  { id: 4, method: 'DELETE', url: '/api/users/{id}', model: 'Users' },
  { id: 5, method: 'GET', url: '/api/roles', model: 'Roles' },
  { id: 6, method: 'POST', url: '/api/roles', model: 'Roles' },
  { id: 7, method: 'GET', url: '/api/permissions', model: 'Permissions' },
];

export const permissionApiService = {
  async getPermissions(): Promise<PermissionResponseDTO[]> {
    try {
      const data = await httpClient.get<PermissionResponseDTO[]>('/permissions/');
      if (data && data.length > 0) return data;
      return DEFAULT_PERMISSIONS;
    } catch {
      const stored = localStorage.getItem('ms_permissions_cache');
      if (stored) {
        try {
          return JSON.parse(stored) as PermissionResponseDTO[];
        } catch {
          // Fallback
        }
      }
      return DEFAULT_PERMISSIONS;
    }
  },

  async createPermission(dto: CreatePermissionDTO): Promise<PermissionResponseDTO> {
    try {
      return await httpClient.post<PermissionResponseDTO>('/permissions/', dto);
    } catch {
      const newPerm: PermissionResponseDTO = { id: Date.now(), ...dto };
      const current = await this.getPermissions();
      localStorage.setItem('ms_permissions_cache', JSON.stringify([newPerm, ...current]));
      return newPerm;
    }
  },

  async updatePermission(id: number, dto: UpdatePermissionDTO): Promise<PermissionResponseDTO> {
    try {
      return await httpClient.put<PermissionResponseDTO>(`/permissions/${id}`, dto);
    } catch {
      const current = await this.getPermissions();
      const updated = current.map((p) => (p.id === id ? { id, ...dto } : p));
      localStorage.setItem('ms_permissions_cache', JSON.stringify(updated));
      return { id, ...dto };
    }
  },

  async deletePermission(id: number): Promise<void> {
    try {
      await httpClient.delete(`/permissions/${id}`);
    } catch {
      const current = await this.getPermissions();
      const filtered = current.filter((p) => p.id !== id);
      localStorage.setItem('ms_permissions_cache', JSON.stringify(filtered));
    }
  },
};

