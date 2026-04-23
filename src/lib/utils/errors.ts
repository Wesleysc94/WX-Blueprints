export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, code: string, statusCode = 500, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const isAppError = (value: unknown): value is AppError =>
  value instanceof AppError;

export const toApiErrorPayload = (error: unknown) => {
  if (isAppError(error)) {
    return {
      status: error.statusCode,
      body: { error: error.message, code: error.code },
    };
  }
  const message = error instanceof Error ? error.message : "Erro interno.";
  return {
    status: 500,
    body: { error: message, code: "INTERNAL_ERROR" },
  };
};
