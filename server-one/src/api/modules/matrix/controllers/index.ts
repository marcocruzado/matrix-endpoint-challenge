import { NextFunction, Request, Response } from 'express';
import { $log } from 'ts-log-debug';
import {
  CONTROLLERS,
  HTTP_STATUS,
  NUMBER,
} from '../../../../config/common/enums';
import { CreationMatrixServices } from '../services';
import responseHandler from '../../../../middlewares/responseHandler';
import { errorHandler } from '../../../../middlewares/errorHandler';

export class CreationMatrixController {
  constructor(private creationMatrixServices: CreationMatrixServices = new CreationMatrixServices()) { }

  public async createMatrix(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      $log.info(`${CONTROLLERS.MATRIX} Method:${req.method} RequestUrl:${req.originalUrl}`);
      const response = await this.creationMatrixServices.createMatrix(req.body);
      $log.debug(`${CONTROLLERS.MATRIX} Response:${JSON.stringify(response, null, NUMBER.TWO)}`);
      responseHandler(response, HTTP_STATUS.STATUS_201, res, next);
    } catch (error) {
      $log.error(`${CONTROLLERS.MATRIX} Method:${req.method} RequestUrl:${req.originalUrl} Error:${error}`);
      errorHandler(error, req, res, next);
    }
  }
}
