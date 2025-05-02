import { Router } from 'express';
import creationMatrixRouter from '../api/modules/matrix/routes/creation-matrix.routes';
import authRouter from '../api/modules/auth/routes/auth-matrix.routes';

const router = Router();

router.use('/creation-matrix', creationMatrixRouter);
router.use('/auth', authRouter);

export default router;
