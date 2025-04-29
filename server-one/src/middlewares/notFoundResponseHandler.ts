import { $log } from "ts-log-debug";
import { Request, Response, NextFunction } from "express";
import ApiError from "../errors/apiErrors";
import { HTTP_STATUS } from "../config/common/enums";


const notFoundResponseHandler = (req: Request, _res: Response, next: NextFunction) => {
  $log.error(`Not Found: ${req.originalUrl}`);
  const error = new ApiError(HTTP_STATUS.STATUS_404, 'Not Found');
  next(error);
};

export default notFoundResponseHandler;