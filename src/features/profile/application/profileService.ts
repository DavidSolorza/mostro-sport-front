import { httpClient } from '../../../core/http/httpClient';
import { HttpError } from '../../../core/errors/HttpError';
import { CreateProfileDTO, ProfileResponseDTO, UpdateProfileDTO } from '../domain/profileModels';

export const profileApiService = {
  async getProfile(userId: number): Promise<ProfileResponseDTO | null> {
    try {
      return await httpClient.get<ProfileResponseDTO>(`/users/${userId}/profile`);
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        localStorage.removeItem(`ms_profile_${userId}`);
        return null;
      }

      const stored = localStorage.getItem(`ms_profile_${userId}`);
      if (stored) {
        try {
          return JSON.parse(stored) as ProfileResponseDTO;
        } catch {
          localStorage.removeItem(`ms_profile_${userId}`);
        }
      }
      return null;
    }
  },

  async saveProfile(
    userId: number,
    data: CreateProfileDTO | UpdateProfileDTO,
    isExisting: boolean
  ): Promise<ProfileResponseDTO> {
    if (isExisting) {
      const updated = await httpClient.put<ProfileResponseDTO>(`/users/${userId}/profile`, data);
      localStorage.setItem(`ms_profile_${userId}`, JSON.stringify(updated));
      return updated;
    }

    const created = await httpClient.post<ProfileResponseDTO>(`/users/${userId}/profile`, data);
    localStorage.setItem(`ms_profile_${userId}`, JSON.stringify(created));
    return created;
  },
};

