import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export interface ValidationSchema {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
  headers?: ZodType;
}

export function validate(schema: ValidationSchema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.params) {
        req.params = (await schema.params.parseAsync(req.params)) as typeof req.params;
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as typeof req.query;
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.headers) {
        await schema.headers.parseAsync(req.headers);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validate;
