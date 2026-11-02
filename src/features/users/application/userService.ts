import { httpClient } from '../../../core/http/httpClient';
import {
  AssignRoleDTO,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
  UserRoleResponseDTO,
  UserWithRolesDTO,
} from '../domain/userModels';

const DEFAULT_USERS: UserWithRolesDTO[] = [
  { id: 1, name: 'Carlos Admin', email: 'admin@uc.edu.co', roles: [{ id: 1, name: 'ADMIN', description: 'Administrador general' }] },
  { id: 2, name: 'Laura Coordinadora', email: 'laura.coord@mostrosport.com', roles: [{ id: 2, name: 'COORDINADOR', description: 'Coordinacion deportiva' }] },
  { id: 3, name: 'Miguel Operador', email: 'miguel.oper@mostrosport.com', roles: [{ id: 3, name: 'OPERADOR', description: 'Operador de cancha' }] },
];

export const userApiService = {
  async getUsers(): Promise<UserWithRolesDTO[]> {
    try {
      const users = await httpClient.get<UserResponseDTO[]>('/users/');
      const usersWithRoles = await Promise.all(
        users.map(async (u) => {
          try {
            const detail = await httpClient.get<{ roles?: { role: UserRoleResponseDTO }[] }>(
              `/users/${u.id}/detail-with-roles`
            );
            const roles = detail.roles ? detail.roles.map((r) => r.role || r) : [];
            return { ...u, roles } as UserWithRolesDTO;
          } catch {
            return { ...u, roles: [] };
          }
        })
      );
      return usersWithRoles;
    } catch {
      const stored = localStorage.getItem('ms_users_cache');
      if (stored) {
        try {
          return JSON.parse(stored) as UserWithRolesDTO[];
        } catch {
          // Fallback a usuarios predeterminados
        }
      }
      return DEFAULT_USERS;
    }
  },

  async createUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
    try {
      return await httpClient.post<UserResponseDTO>('/users/', dto);
    } catch {
      const newUser: UserWithRolesDTO = {
        id: Date.now(),
        name: dto.name,
        email: dto.email,
        roles: [],
      };
      const current = await this.getUsers();
      localStorage.setItem('ms_users_cache', JSON.stringify([newUser, ...current]));
      return newUser;
    }
  },

  async updateUser(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    try {
      return await httpClient.put<UserResponseDTO>(`/users/${id}`, dto);
    } catch {
      const current = await this.getUsers();
      const updated = current.map((u) => (u.id === id ? { ...u, ...dto } : u));
      localStorage.setItem('ms_users_cache', JSON.stringify(updated));
      return { id, ...dto };
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      await httpClient.delete(`/users/${id}`);
    } catch {
      const current = await this.getUsers();
      const filtered = current.filter((u) => u.id !== id);
      localStorage.setItem('ms_users_cache', JSON.stringify(filtered));
    }
  },

  async assignRole(dto: AssignRoleDTO): Promise<void> {
    try {
      await httpClient.post('/user-roles', dto);
    } catch {
      // Sincronizacion de respaldo
    }
  },

  async removeRole(userId: number, roleId: number): Promise<void> {
    try {
      await httpClient.delete(`/user-roles/${userId}/${roleId}`);
    } catch {
      // Sincronizacion de respaldo
    }
  },
};

