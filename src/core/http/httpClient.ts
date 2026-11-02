import { ENV_CONFIG } from '../config/env';
import { ApiErrorPayload, HttpError } from '../errors/HttpError';

type UnauthorizedListener = () => void;
type ForbiddenListener = (message: string) => void;

class NativeHttpClient {
  private readonly baseUrl: string;
  private onUnauthorized?: UnauthorizedListener;
  private onForbidden?: ForbiddenListener;

  constructor(baseUrl: string) {
    console.log(baseUrl);
    
    this.baseUrl = baseUrl;
  }

  public setInterceptors(
    onUnauthorized: UnauthorizedListener,
    onForbidden: ForbiddenListener
  ): void {
    this.onUnauthorized = onUnauthorized;
    this.onForbidden = onForbidden;
  }

  public async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' });
  }

  public async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = void>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');

    if (options.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    const data: unknown = text ? this.safeParseJson(text) : null;

    if (!response.ok) {
      this.handleErrorResponse(response.status, data, path);
    }

    return data as T;
  }

  private safeParseJson(text: string): unknown {
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  private handleErrorResponse(status: number, data: unknown, path: string): never {
    const payload = (data && typeof data === 'object' ? data : {}) as ApiErrorPayload;
    const isAuthEndpoint = path.startsWith('/auth/login');

    if (status === 401 && !isAuthEndpoint && this.onUnauthorized) {
      this.onUnauthorized();
    }

    if (status === 403) {
      const msg = payload.message || 'Acceso denegado: ninguno de tus roles posee el permiso para esta operación.';
      if (this.onForbidden) {
        this.onForbidden(msg);
      }
      throw new HttpError(403, msg, 'FORBIDDEN');
    }

    if (status === 400 && !payload.errorCase) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(payload).forEach(([key, val]) => {
        if (typeof val === 'string') {
          fieldErrors[key] = val;
        }
      });
      const firstMessage = Object.values(fieldErrors)[0] || 'Datos de entrada inválidos.';
      throw new HttpError(400, firstMessage, 'VALIDATION_ERROR', fieldErrors);
    }

    const message = payload.message || `Error HTTP ${status} al comunicar con el servidor.`;
    const errorCase = payload.errorCase || 'HTTP_ERROR';
    throw new HttpError(status, message, errorCase);
  }
}

export const httpClient = new NativeHttpClient(ENV_CONFIG.API_BASE_URL);

