import { Router } from 'express';
import matrixStatsRouter from '../api/modules/matrix/routes/matrix-stats.routes';

const router = Router();

router.use('/matrix-stats', matrixStatsRouter);

export default router;
