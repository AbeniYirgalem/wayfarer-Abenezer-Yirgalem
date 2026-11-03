import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';
import config from '../config';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError || err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = (err as ZodError).issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: unknown };
    if (prismaErr.code === 'P2002') {
      statusCode = 409;
      message = 'A duplicate record constraint violation occurred';
      errors = [prismaErr.meta];
    } else if (prismaErr.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = 'Database operation failed';
      errors = [prismaErr.meta];
    }
  } else if (err.message) {
    message = err.message;
  }

  // Log non-operational errors or non-test errors
  if (config.nodeEnv !== 'test') {
    console.error(`[Error] ${statusCode} - ${message}`, err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    error: {
      message,
      ...(errors.length > 0 ? { details: errors } : {}),
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    },
  });
}

export default errorHandler;
