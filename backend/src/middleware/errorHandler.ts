import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import config from '../config';

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    details = (err as unknown as { issues: unknown }).issues;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: unknown };
    if (prismaErr.code === 'P2002') {
      statusCode = 409;
      message = 'A unique constraint violation occurred';
      details = prismaErr.meta;
    } else if (prismaErr.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      statusCode = 400;
      message = 'Database operation failed';
      details = prismaErr.meta;
    }
  } else if (err.message) {
    message = err.message;
  }

  // Log error in non-test environments
  if (config.nodeEnv !== 'test') {
    console.error(`[Error] ${statusCode} - ${message}`, err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
    },
  });
}

