import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): Response {
  return res.status(404).json({
    success: false,
    error: {
      message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    },
  });
}

