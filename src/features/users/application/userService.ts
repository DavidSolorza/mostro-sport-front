import { httpClient } from '../../../core/http/httpClient';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../domain/userModels';

export const userApiService = {
  list(): Promise<UserResponseDTO[]> {
    return httpClient.get<UserResponseDTO[]>('/users/');
  },

  create(dto: CreateUserDTO): Promise<UserResponseDTO> {
    return httpClient.post<UserResponseDTO>('/users/', dto);
  },

  update(id: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    return httpClient.put<UserResponseDTO>(`/users/${id}`, dto);
  },

  remove(id: number): Promise<void> {
    return httpClient.delete<void>(`/users/${id}`);
  },
};
