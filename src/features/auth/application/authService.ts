import { httpClient } from '../../../core/http/httpClient';
import { AuthProviderType } from '../../../core/auth/AuthContext';
import {
  AuthResponseDTO,
  ForgotPasswordRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  ResetPasswordRequestDTO,
} from '../domain/authModels';

export const authApiService = {
  async login(dto: LoginRequestDTO): Promise<AuthResponseDTO> {
    return httpClient.post<AuthResponseDTO>('/auth/login', dto);
  },

  async register(dto: RegisterRequestDTO): Promise<{ id: number; name: string; email: string }> {
    try {
      return await httpClient.post<{ id: number; name: string; email: string }>('/auth/register', dto);
    } catch {
      return httpClient.post<{ id: number; name: string; email: string }>('/users/', dto);
    }
  },

  async loginWithOAuth(
    provider: Exclude<AuthProviderType, 'LOCAL'>,
    email?: string
  ): Promise<AuthResponseDTO> {
    return httpClient.post<AuthResponseDTO>(`/auth/oauth/${provider.toLowerCase()}`, {
      provider,
      email,
    });
  },

  async requestPasswordRecovery(dto: ForgotPasswordRequestDTO): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>('/auth/forgot-password', dto);
  },

  async resetPassword(dto: ResetPasswordRequestDTO): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>('/auth/reset-password', dto);
  },
};

