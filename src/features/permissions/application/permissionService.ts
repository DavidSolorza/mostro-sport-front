import { httpClient } from '../../../core/http/httpClient';
import { CreatePermissionDTO, PermissionResponseDTO, UpdatePermissionDTO } from '../domain/permissionModels';

export const permissionApiService = {
  async getPermissions(): Promise<PermissionResponseDTO[]> {
    try {
      const data = await httpClient.get<PermissionResponseDTO[]>('/permissions/');
      if (data && data.length > 0) return data;
      return [];
    } catch {
      const stored = localStorage.getItem('ms_permissions_cache');
      if (stored) {
        try {
          return JSON.parse(stored) as PermissionResponseDTO[];
        } catch {
          return [];
        }
      }
      return [];
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

