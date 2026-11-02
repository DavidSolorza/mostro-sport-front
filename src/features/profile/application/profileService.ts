import { httpClient } from '../../../core/http/httpClient';
import { CreateProfileDTO, ProfileResponseDTO, UpdateProfileDTO } from '../domain/profileModels';

export const profileApiService = {
  async getProfile(userId: number): Promise<ProfileResponseDTO | null> {
    try {
      return await httpClient.get<ProfileResponseDTO>(`/users/${userId}/profile`);
    } catch {
      const stored = localStorage.getItem(`ms_profile_${userId}`);
      if (stored) {
        try {
          return JSON.parse(stored) as ProfileResponseDTO;
        } catch {
          // Fallback
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
    try {
      if (isExisting) {
        return await httpClient.put<ProfileResponseDTO>(`/users/${userId}/profile`, data);
      }
      return await httpClient.post<ProfileResponseDTO>(`/users/${userId}/profile`, data);
    } catch {
      const fallback: ProfileResponseDTO = {
        id: Date.now(),
        phone: data.phone,
        birthDate: data.birthDate,
        photoUrl: data.photoUrl,
      };
      localStorage.setItem(`ms_profile_${userId}`, JSON.stringify(fallback));
      return fallback;
    }
  },
};

