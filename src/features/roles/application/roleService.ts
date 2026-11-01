import { httpClient } from '../../../core/http/httpClient';
import {
  CreateRoleDTO,
  RoleUserResponseDTO,
  RoleResponseDTO,
  UpdateRoleDTO,
  UserRoleResponseDTO,
} from '../domain/roleModels';
import { UserResponseDTO } from '../../users/domain/userModels';

export const roleApiService = {
  list(): Promise<RoleResponseDTO[]> {
    return httpClient.get<RoleResponseDTO[]>('/roles/');
  },

  create(dto: CreateRoleDTO): Promise<RoleResponseDTO> {
    return httpClient.post<RoleResponseDTO>('/roles/', dto);
  },

  update(id: number, dto: UpdateRoleDTO): Promise<RoleResponseDTO> {
    return httpClient.put<RoleResponseDTO>(`/roles/${id}`, dto);
  },

  remove(id: number): Promise<void> {
    return httpClient.delete<void>(`/roles/${id}`);
  },

  listUsers(): Promise<UserResponseDTO[]> {
    return httpClient.get<UserResponseDTO[]>('/users/');
  },

  listRoleAssignments(roleId: number): Promise<RoleUserResponseDTO[]> {
    return httpClient.get<RoleUserResponseDTO[]>(`/user-roles/roles/${roleId}`);
  },

  listUserAssignments(userId: number): Promise<UserRoleResponseDTO[]> {
    return httpClient.get<UserRoleResponseDTO[]>(`/user-roles/users/${userId}`);
  },

  assignUser(userId: number, roleId: number): Promise<UserRoleResponseDTO> {
    return httpClient.post<UserRoleResponseDTO>('/user-roles', { userId, roleId });
  },

  removeUserRole(userId: number, roleId: number): Promise<void> {
    return httpClient.delete<void>(`/user-roles/${userId}/${roleId}`);
  },
};
