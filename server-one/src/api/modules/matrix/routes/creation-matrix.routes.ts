import { Router } from 'express';
import { CreationMatrixController } from '../controllers';
import { createMatrixValidationHandler } from '../middlewares/create-validation';
import { verifiedTokenAccess } from '../../../../middlewares/verifiedTokenAccess';


const creationMatrixRouter = Router();
const creationMatrixController = new CreationMatrixController();

creationMatrixRouter.post(
  '/qr-factorization',
  verifiedTokenAccess,
  createMatrixValidationHandler,
  creationMatrixController.createMatrix.bind(creationMatrixController)
);

export default creationMatrixRouter;
