export interface RoleResponseDTO {
  id: number;
  name: string;
  description: string;
}

export interface CreateRoleDTO {
  name: string;
  description: string;
}

export type UpdateRoleDTO = CreateRoleDTO;

export interface UserRoleResponseDTO {
  id: number;
  userId: number;
  role: RoleResponseDTO;
}

export interface RoleUserResponseDTO {
  id: number;
  roleId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
