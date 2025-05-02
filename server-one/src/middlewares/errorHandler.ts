import { Response, Request, NextFunction } from 'express';
import { $log } from 'ts-log-debug';
import axios from 'axios';
import { AxiosError } from 'axios';
import { isCelebrateError, CelebrateError } from 'celebrate';
import ApiError from '../errors/apiErrors';
import { HTTP_STATUS } from '../config/common/enums';
import { cleanDoubleQuotes } from '../utils/string-operations';
import { HttpException } from '../config/common/errors/error.handler';


interface ErrorResponse<T = any> {
  status: string;
  message: string;
  data?: T;
}


function formatCelebrateErrors(error: CelebrateError): Record<string, string> {
  return [...error.details.values()].reduce<Record<string, string>>((acc, segment) => {
    const newAcc = { ...acc };
    segment.details.forEach((detail) => {
      const key = detail.path.join('.');
      newAcc[key] = cleanDoubleQuotes(detail.message);
    });
    return newAcc;
  }, {});
}

function handleCelebrateError(error: CelebrateError, res: Response) {
  const errors = formatCelebrateErrors(error);
  $log.error(`Validation Error: ${JSON.stringify(errors)}`);
  res.status(HTTP_STATUS.STATUS_400).json({
    status: 'error',
    message: 'Validation Error',
    data: errors,
  });
}

function handleApiError(error: ApiError, res: Response) {
  $log.error(`Api Error failed: handleApiError`);
  $log.error(error);
  res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message || 'An unexpected error occurred',
  });
}



function handleHttpError(error: HttpException, res: Response) {
  $log.error(`Http Error failed: handleHttpError`);
  $log.error(error);

  const errorResponse: ErrorResponse = {
    status: error.status || 'error',
    message: error.message,
  };

  if (error.data) {
    errorResponse.data = error.data;
  }

  res.status(error.statusCode).json(errorResponse);
}


function handleAxiosError(error: AxiosError, res: Response) {
  $log.error(`Axios Error failed: handleAxiosError`);
  $log.error(error.response?.data);
  res.status(error.status!).json({
    status: 'error',
    message: error.message
  });
}


function handleGenericError(error: Error | unknown, res: Response) {
  $log.error(`Generic Error failed: handleGenericError`);
  $log.error(error);
  res.status(HTTP_STATUS.STATUS_500).json({
    status: 'error',
    statusCode: HTTP_STATUS.STATUS_500,
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
  });
}



export const errorHandler = (
  err: ApiError | CelebrateError | Error | HttpException | AxiosError | unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  $log.debug(_next);
  if (isCelebrateError(err)) {
    handleCelebrateError(err, res);
  } else if (err instanceof ApiError) {
    handleApiError(err, res);
  } else if (err instanceof HttpException) {
    handleHttpError(err, res);
  } else if (err instanceof AxiosError) {
    handleAxiosError(err, res);
  } else {
    handleGenericError(err, res);
  }
};

