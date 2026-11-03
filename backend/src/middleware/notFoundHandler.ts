import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): Response {
  const message = `Cannot ${req.method} ${req.originalUrl} - Route not found`;
  return res.status(404).json({
    success: false,
    message,
    errors: [message],
    error: {
      message,
    },
  });
}

export default notFoundHandler;
