import { $log } from 'ts-log-debug';
import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';
import { SERVICES, METHOD, NUMBER } from '../config/common/enums';
import { SECRET_KEY, EXPIRATION_TIME, ALGORITHM } from '../config/common/constants';

export class AuthOperation {
    private static readonly REFRESH_TOKEN_EXPIRATION = '7d'; // 7 días para el refresh token

    public static async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
        $log.info(`${SERVICES.AUTH} Generate Tokens Method:${METHOD.POST}`);
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        const accessTokenOptions: SignOptions = { 
            expiresIn: Number(EXPIRATION_TIME), 
            algorithm: ALGORITHM as Algorithm 
        };
        const accessToken = jwt.sign(payload, SECRET_KEY as jwt.Secret, accessTokenOptions);

        const refreshTokenOptions: SignOptions = { 
            expiresIn: this.REFRESH_TOKEN_EXPIRATION, 
            algorithm: ALGORITHM as Algorithm 
        };
        const refreshToken = jwt.sign(payload, SECRET_KEY as jwt.Secret, refreshTokenOptions);

        $log.debug(`${SERVICES.AUTH} Access Token:${accessToken}`);
        $log.debug(`${SERVICES.AUTH} Refresh Token:${refreshToken}`);
        
        return { accessToken, refreshToken };
    }

    public static async generateAccessToken(user: any): Promise<string> {
        $log.info(`${SERVICES.AUTH} Generate Access Token Method:${METHOD.POST}`);
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        const options: SignOptions = { 
            expiresIn: Number(EXPIRATION_TIME), 
            algorithm: ALGORITHM as Algorithm 
        };
        
        const accessToken = jwt.sign(payload, SECRET_KEY as jwt.Secret, options);
        $log.debug(`${SERVICES.AUTH} Access Token:${accessToken}`);
        return accessToken;
    }

    public static async verifyToken(token: string): Promise<any> {
        $log.info(`${SERVICES.AUTH} Verify Token Method:${METHOD.POST}`);
        const decoded = jwt.verify(token, SECRET_KEY as jwt.Secret);
        $log.debug(`${SERVICES.AUTH} Decoded:${JSON.stringify(decoded, null, NUMBER.TWO)}`);    
        return decoded;
    }

    public static async decodeToken(token: string): Promise<any> {
        $log.info(`${SERVICES.AUTH} Decode Token  Method:${METHOD.POST}`);
        const decoded = jwt.decode(token);
        $log.debug(`${SERVICES.AUTH} Decoded:${decoded}`);
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }
        return decoded;
    }

    public static async refreshAccessToken(refreshToken: string): Promise<string> {
        $log.info(`${SERVICES.AUTH} Refresh Access Token Method:${METHOD.POST}`);
        try {
            const decoded = await this.verifyToken(refreshToken);
            
            const payload = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name
            };
            
            const options: SignOptions = { 
                expiresIn: Number(EXPIRATION_TIME), 
                algorithm: ALGORITHM as Algorithm 
            };
            
            const newAccessToken = jwt.sign(payload, SECRET_KEY as jwt.Secret, options);
            $log.debug(`${SERVICES.AUTH} New Access Token:${newAccessToken}`);
            return newAccessToken;
        } catch (error) {
            $log.error(`${SERVICES.AUTH} Error refreshing token:${error}`);
            throw new Error('Invalid refresh token');
        }
    }
}
