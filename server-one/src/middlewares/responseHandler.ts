import { Response, NextFunction } from 'express';

const responseHandler = <T>(
  data: T,
  statusCode: number = 200,
  res: Response,
  next: NextFunction
) => {
  res.locals.responseData = {
    data,
    statusCode,
  };
  next();
};

export default responseHandler;
