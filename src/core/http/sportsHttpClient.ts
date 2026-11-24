import { ENV_CONFIG } from '../config/env';
import { HttpError } from '../errors/HttpError';

class SportsHttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
    headers.set('x-bypass-security', 'true');

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
      const err = (data && typeof data === 'object') ? data as { message?: string | string[] } : {};
      const raw = Array.isArray(err.message) ? err.message.join(' · ') : err.message;
      const msg = raw || `Error ${response.status} en Sports API`;
      throw new HttpError(response.status, msg, 'SPORTS_API_ERROR');
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
}

export const sportsHttpClient = new SportsHttpClient(ENV_CONFIG.SPORTS_API_URL);
