export interface PermissionResponseDTO {
  id: number;
  url: string;
  method: string;
  model: string;
}

export interface CreatePermissionDTO {
  url: string;
  method: string;
  model: string;
}

export interface UpdatePermissionDTO {
  url: string;
  method: string;
  model: string;
}

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

