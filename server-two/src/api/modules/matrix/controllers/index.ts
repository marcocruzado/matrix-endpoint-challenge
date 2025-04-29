import { NextFunction, Request, Response } from 'express';
import { $log } from 'ts-log-debug';
import {
  CONTROLLERS,
  HTTP_STATUS,
  NUMBER,
} from '../../../../config/common/enums';
import { MatrixStatsService } from '../services';
import responseHandler from '../../../../middlewares/responseHandler';
import { errorHandler } from '../../../../middlewares/errorHandler';

export class MatrixStatsController {
  constructor(private matrixStatsService: MatrixStatsService = new MatrixStatsService()) {}

  public async processMatrices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      $log.info(`${CONTROLLERS.MATRIX} Method:${req.method} RequestUrl:${req.originalUrl}`);
      const response = await this.matrixStatsService.processMatrices(req.body);
      $log.debug(`${CONTROLLERS.MATRIX} Response:${JSON.stringify(response, null, NUMBER.TWO)}`);
      responseHandler(response, HTTP_STATUS.STATUS_200, res, next);
    } catch (error) {
      $log.error(`${CONTROLLERS.MATRIX} Method:${req.method} RequestUrl:${req.originalUrl} Error:${error}`);
      errorHandler(error, req, res, next);
    }
  }
}
