import { $log } from 'ts-log-debug';
import { Request, Response, NextFunction } from 'express';
import { AuthOperation } from '../utils/auth-jwt-operation';
import { STATUS_CODE, SERVICES, NUMBER } from '../config/common/enums';

export const verifiedTokenAccess = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => { 
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'No token provided' });
    }
    try {
        const decoded = await AuthOperation.verifyToken(token);
        $log.debug(`${SERVICES.AUTH} Decoded:${JSON.stringify(decoded, null, NUMBER.TWO)}`);
        req.body.user = decoded;
        return next();
    } catch (error) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};
