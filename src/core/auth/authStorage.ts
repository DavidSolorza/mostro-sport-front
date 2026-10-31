import { ENV_CONFIG } from '../config/env';
import { decodeJwtPayload, isJwtExpired } from './jwtDecoder';

export type AuthProviderType = 'LOCAL' | 'GOOGLE' | 'GITHUB' | 'MICROSOFT';

export interface AuthUserSession {
  userId: number;
  email: string;
  name?: string;
  authProvider: AuthProviderType;
  expiresAt: string;
  twoFactorEnabled: boolean;
}

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const authStorage = {
  getStoredSession(): AuthUserSession | null {
    try {
      const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      const expiresAt = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT) || '';
      const provider = (localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_PROVIDER) as AuthProviderType) || 'LOCAL';
      const twoFactorMap = safeJsonParse<Record<string, boolean>>(
        localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED),
        {}
      );

      if (!token || isJwtExpired(token)) {
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        return null;
      }

      const claims = decodeJwtPayload(token);
      if (!claims) return null;

      return {
        userId: Number(claims.sub) || 0,
        email: claims.email || '',
        authProvider: provider,
        expiresAt,
        twoFactorEnabled: Boolean(twoFactorMap[claims.email]),
      };
    } catch {
      return null;
    }
  },

  saveSession(token: string, expiresAt: string, provider: AuthProviderType): void {
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT, expiresAt);
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.AUTH_PROVIDER, provider);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN);
  },

  clearSession(): void {
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.EXPIRES_AT);
  },

  getPending2FAEmail(): string | null {
    return localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
  },

  getPending2FAToken(): { tempToken: string; expiresAt: string } | null {
    return safeJsonParse<{ tempToken: string; expiresAt: string } | null>(
      localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN),
      null
    );
  },

  setPending2FA(email: string, tempToken: string, expiresAt: string): void {
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL, email);
    localStorage.setItem(
      ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN,
      JSON.stringify({ tempToken, expiresAt })
    );
  },

  clearPending2FA(): void {
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_EMAIL);
    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.PENDING_2FA_TOKEN);
  },

  setTwoFactorPreference(email: string, enabled: boolean): void {
    const map = safeJsonParse<Record<string, boolean>>(
      localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED),
      {}
    );
    map[email] = enabled;
    localStorage.setItem(ENV_CONFIG.STORAGE_KEYS.TWO_FACTOR_ENABLED, JSON.stringify(map));
  },
};

