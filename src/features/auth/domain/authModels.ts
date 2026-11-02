export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  requiresTwoFactor?: boolean;
  challengeToken?: string;
}

export interface RegisterRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  newPassword: string;
}

export const PASSWORD_RULES = {
  minLength: (p: string): boolean => p.length >= 8 && p.length <= 72,
  hasLower: (p: string): boolean => /[a-z]/.test(p),
  hasUpper: (p: string): boolean => /[A-Z]/.test(p),
  hasDigit: (p: string): boolean => /\d/.test(p),
  hasSpecial: (p: string): boolean => /[@$!%*?&]/.test(p),
  noSpaces: (p: string): boolean => !/\s/.test(p),
  isValid: (p: string): boolean =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])\S{8,72}$/.test(p),
};

