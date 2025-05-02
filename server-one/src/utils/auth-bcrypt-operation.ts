import { $log } from 'ts-log-debug';
import bcrypt from 'bcrypt';
import { SERVICES, METHOD } from '../config/common/enums';
import { SALT_ROUNDS } from '../config/common/constants';

export class AuthBcryptOperation {
    public static async hashPassword(password: string): Promise<string> {
        $log.info(`${SERVICES.AUTH} Method:${METHOD.POST}`);
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        $log.debug(`${SERVICES.AUTH} Hash:${hash}`);
        return hash;
    }

    public static async comparePassword(password: string, hash: string): Promise<boolean> {
        $log.info(`${SERVICES.AUTH} Method:${METHOD.POST}`);
        const isPasswordValid = await bcrypt.compare(password, hash);
        $log.debug(`${SERVICES.AUTH} IsPasswordValid:${isPasswordValid}`);
        return isPasswordValid;
    }
}

