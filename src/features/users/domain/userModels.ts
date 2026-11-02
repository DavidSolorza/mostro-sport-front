export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserDTO {
  name: string;
  email: string;
}

export interface UserRoleResponseDTO {
  id: number;
  name: string;
  description: string;
}

export interface UserWithRolesDTO extends UserResponseDTO {
  roles?: UserRoleResponseDTO[];
}

export interface AssignRoleDTO {
  userId: number;
  roleId: number;
}

