import { Router } from 'express';
import { CreationMatrixController } from '../controllers';
import { createMatrixValidationHandler } from '../middlewares/create-validation';

const creationMatrixRouter = Router();
const creationMatrixController = new CreationMatrixController();

creationMatrixRouter.post(
  '/qr-factorization',
  createMatrixValidationHandler,
  creationMatrixController.createMatrix.bind(creationMatrixController)
);

export default creationMatrixRouter;
