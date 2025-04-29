import { Request, Response, NextFunction } from 'express';

const succesResponseHandler = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.responseData) {
    return next();
  }
  const { data, statusCode } = res.locals.responseData;
  res.status(statusCode).json({
    data,
  });
};

export default succesResponseHandler;
