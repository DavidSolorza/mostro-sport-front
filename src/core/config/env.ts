export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'ms_security_access_token',
    EXPIRES_AT: 'ms_security_expires_at',
    AUTH_PROVIDER: 'ms_security_auth_provider',
    PENDING_2FA_EMAIL: 'ms_security_pending_2fa_email',
    PENDING_2FA_TOKEN: 'ms_security_pending_2fa_token',
    TWO_FACTOR_ENABLED: 'ms_security_2fa_enabled',
    PROFILE_PHOTOS_MAP: 'ms_security_profile_photos',
  },
} as const;

