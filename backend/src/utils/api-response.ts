import { Response } from 'express';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown[];
  error?: {
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): Response {
  const payload: ApiResponsePayload<T> = {
    success: true,
  };
  if (message) payload.message = message;
  if (data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors: unknown[] = []
): Response {
  const payload: ApiResponsePayload = {
    success: false,
    message,
    errors,
    error: {
      message,
      ...(errors.length > 0 ? { details: errors } : {}),
    },
  };
  return res.status(statusCode).json(payload);
}

export default {
  sendSuccess,
  sendError,
};
