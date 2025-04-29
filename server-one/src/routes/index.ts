import { Router } from 'express';
import creationMatrixRouter from '../api/modules/matrix/routes/creation-matrix.routes';

const router = Router();

router.use('/creation-matrix', creationMatrixRouter);

export default router;
