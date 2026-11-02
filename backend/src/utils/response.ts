import { Response } from 'express';

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(res: Response, data?: T, message?: string, statusCode = 200): Response {
  const response: ApiResponseData<T> = {
    success: true,
  };
  if (message) response.message = message;
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 500, details?: unknown): Response {
  const response: ApiResponseData = {
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  };
  return res.status(statusCode).json(response);
}

