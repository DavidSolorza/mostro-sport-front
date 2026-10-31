export interface DecodedJwtClaims {
  sub: string;
  email: string;
  exp: number;
  iat: number;
  jti: string;
}

export function decodeJwtPayload(token: string): DecodedJwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedJwtClaims;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const claims = decodeJwtPayload(token);
  if (!claims || !claims.exp) {
    return true;
  }
  return Date.now() >= claims.exp * 1000;
}

