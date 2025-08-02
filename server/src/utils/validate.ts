import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AppError from 'src/models/AppError';

const validate = (req: Request, _: Response, next: NextFunction): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      new AppError('Validation Error', 500, {
        validationError: true,
        errors: errors.array(),
      }),
    );
    return false;
  }
  return true;
};

export default validate;
