/*
Esta chumba por ahora es seguro subirla
El client ID del oauth no es información sensible
El secret lo tiene el backend
*/

export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/api',
  GITHUB_OAUTH_URL: "https://github.com/login/oauth/authorize/",
  GOOGLE_CLIENT_ID:
    import.meta.env.VITE_GOOGLE_CLIENT_ID || '168778492399-kapqdrpcn1qb2ljncb8hto558ofpub06.apps.googleusercontent.com',
  GITHUB_CLIENT_ID:
    import.meta.env.VITE_GITHUB_CLIENT_ID || "Ov23lidhAC4yVjTt2R9C",
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

