import { Request, Response, NextFunction } from 'express';
import AppError from 'src/models/AppError';
import AppResponse from 'src/models/AppResponse';
import logger from 'src/utils/logger';

const responseHandler = async (
  result: Error | AppError | AppResponse,
  req: Request,
  res: Response,
  __: NextFunction,
) => {
  let r = result;
  if (result instanceof Error) {
    logger.error((result as Error).message, {
      stack: (result as Error).stack,
      params: req.params,
      body: req.body,
      url: req.url,
      method: req.method,
    });
    r = new AppError('Internal Server Error');
  }

  return res.status((r as AppError | AppResponse).status).json(r);
};

export default responseHandler;
