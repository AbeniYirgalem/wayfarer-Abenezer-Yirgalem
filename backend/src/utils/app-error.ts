export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors: unknown[];
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    this.details = errors.length > 0 ? errors : undefined;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', errors: unknown[] = []): AppError {
    return new AppError(400, message, errors);
  }

  static notFound(message = 'Resource not found', errors: unknown[] = []): AppError {
    return new AppError(404, message, errors);
  }

  static conflict(message = 'Conflict', errors: unknown[] = []): AppError {
    return new AppError(409, message, errors);
  }

  static unprocessable(message = 'Unprocessable entity', errors: unknown[] = []): AppError {
    return new AppError(422, message, errors);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, message, [], false);
  }
}

export const ApiError = AppError;
export default AppError;
