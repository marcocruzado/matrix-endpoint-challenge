import { $log } from 'ts-log-debug';
import { SERVICES, NUMBER, METHOD } from '../../../../config/common/enums';
import { AuthRepository } from '../repository';
import { AuthOperation } from '../../../../utils/auth-jwt-operation';
import { AuthBcryptOperation } from '../../../../utils/auth-bcrypt-operation';

export class AuthServices {
    constructor(private authRepository: AuthRepository = new AuthRepository()) { }

    public async login(email: string, password: string): Promise<any> {
        try {
            $log.info(`${SERVICES.AUTH} Method:${METHOD.POST}`);
            const user = await this.authRepository.login(email);
            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await AuthBcryptOperation.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            if (user.refreshToken && user.tokenExpiresAt && user.tokenExpiresAt > new Date()) {
                const accessToken = await AuthOperation.generateAccessToken(user);
                return {
                    user,
                    accessToken,
                    refreshToken: user.refreshToken
                };
            }

            const { accessToken, refreshToken } = await AuthOperation.generateTokens(user);
            
            await this.authRepository.updateRefreshToken(user.id, refreshToken);

            $log.debug(`${SERVICES.AUTH} Response:${JSON.stringify({ user, accessToken, refreshToken }, null, NUMBER.TWO)}`);
            return {
                user,
                accessToken,
                refreshToken
            };
        } catch (error) {
            $log.error(`${SERVICES.AUTH} Method:${METHOD.POST} Error:${error}`);
            throw error;
        }
    }

    public async register(user: any): Promise<any> {
        try {
            $log.info(`${SERVICES.AUTH} Method:${METHOD.POST}`);
            const existingUser = await this.authRepository.findByEmail(user.email);
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await AuthBcryptOperation.hashPassword(user.password);
            const newUser = await this.authRepository.register(user, hashedPassword);
            $log.debug(`${SERVICES.AUTH} Response Register:${JSON.stringify(newUser, null, NUMBER.TWO)}`);
            
            const { accessToken, refreshToken } = await AuthOperation.generateTokens(newUser);
            
            await this.authRepository.updateRefreshToken(newUser.id, refreshToken);

            $log.debug(`${SERVICES.AUTH} Response Tokens:${JSON.stringify({ user: newUser, accessToken, refreshToken }, null, NUMBER.TWO)}`);
            return {
                user: newUser,
                accessToken,
                refreshToken
            };
        } catch (error) {
            $log.error(`${SERVICES.AUTH} Method:${METHOD.POST} Error:${error}`);
            throw error;
        }
    }

    public async refreshToken(refreshToken: string): Promise<any> {
        try {
            $log.info(`${SERVICES.AUTH} Refresh Token Method:${METHOD.POST}`);
            
            const user = await this.authRepository.findByRefreshToken(refreshToken);
            if (!user) {
                throw new Error('Invalid refresh token');
            }
            if (!user.tokenExpiresAt || user.tokenExpiresAt <= new Date()) {
                throw new Error('Refresh token expired');
            }

            const newAccessToken = await AuthOperation.generateAccessToken(user);
            
            $log.debug(`${SERVICES.AUTH} Response:${JSON.stringify({ accessToken: newAccessToken }, null, NUMBER.TWO)}`);
            return { 
                accessToken: newAccessToken,
                refreshToken: user.refreshToken
            };
        } catch (error) {
            $log.error(`${SERVICES.AUTH} Method:${METHOD.POST} Error:${error}`);
            throw error;
        }
    }
}

