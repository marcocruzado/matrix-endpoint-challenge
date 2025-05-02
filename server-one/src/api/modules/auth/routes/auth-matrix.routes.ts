import { Router } from 'express';
import { AuthController } from '../controllers';
import { verifiedTokenAccess } from '../../../../middlewares/verifiedTokenAccess';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/refresh-token', verifiedTokenAccess, authController.refreshToken.bind(authController));

export default authRouter;
