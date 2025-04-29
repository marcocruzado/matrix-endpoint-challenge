import { Router } from 'express';
import { MatrixStatsController } from '../controllers';
import { matrixStatsValidation } from '../middlewares/matrix-stats-validation';

const matrixStatsRouter = Router();
const matrixStatsController = new MatrixStatsController();

matrixStatsRouter.post(
  '/stadistics',
  matrixStatsValidation,
  matrixStatsController.processMatrices.bind(matrixStatsController)
);

export default matrixStatsRouter;
