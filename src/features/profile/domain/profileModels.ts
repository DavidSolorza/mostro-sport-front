export interface ProfileResponseDTO {
  id: number;
  phone: string;
  birthDate: string;
  photoUrl: string;
}

export interface CreateProfileDTO {
  phone: string;
  birthDate: string;
  photoUrl: string;
}

export interface UpdateProfileDTO {
  phone: string;
  birthDate: string;
  photoUrl: string;
}

