export interface ApiErrorPayload {
  errorCase?: string;
  message?: string;
  [field: string]: string | undefined;
}

export class HttpError extends Error {
  public readonly status: number;
  public readonly errorCase: string;
  public readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    errorCase = 'HTTP_ERROR',
    fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.errorCase = errorCase;
    this.fieldErrors = fieldErrors;
  }
}

