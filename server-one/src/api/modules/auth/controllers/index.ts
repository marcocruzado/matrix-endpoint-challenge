import { NextFunction, Request, Response } from 'express';
import { $log } from 'ts-log-debug';
import {
  CONTROLLERS,
  HTTP_STATUS,
  NUMBER,
  METHOD,
} from '../../../../config/common/enums';
import { AuthServices } from '../services';
import responseHandler from '../../../../middlewares/responseHandler';
import { errorHandler } from '../../../../middlewares/errorHandler';

export class AuthController {
  constructor(private authServices: AuthServices = new AuthServices()) {}

  public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      $log.info(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl}`);
      const { email, password } = req.body;
      const user = await this.authServices.login(email, password);
      $log.debug(`${CONTROLLERS.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
      responseHandler(user, HTTP_STATUS.STATUS_200, res, next);
    } catch (error) {
      $log.error(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl} Error:${error}`);
      errorHandler(error, req, res, next);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      $log.info(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl}`);
      const user = await this.authServices.register(req.body);
      $log.debug(`${CONTROLLERS.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
      responseHandler(user, HTTP_STATUS.STATUS_200, res, next);
    } catch (error) {
      $log.error(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl} Error:${error}`);
      errorHandler(error, req, res, next);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      $log.info(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl}`);
      const { refreshToken } = req.body;
      const tokens = await this.authServices.refreshToken(refreshToken);
      $log.debug(`${CONTROLLERS.AUTH} Response:${JSON.stringify(tokens, null, NUMBER.TWO)}`);
      responseHandler(tokens, HTTP_STATUS.STATUS_200, res, next);
    } catch (error) {
      $log.error(`${CONTROLLERS.AUTH} Method:${METHOD.POST} RequestUrl:${req.originalUrl} Error:${error}`);
      errorHandler(error, req, res, next);
    }
  }
}
