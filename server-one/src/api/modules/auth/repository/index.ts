import { $log } from 'ts-log-debug';
import { PrismaClient } from '@prisma/client';
import { METHOD, REPOSITORIES, NUMBER } from '../../../../config/common/enums';

export class AuthRepository {
    constructor(private prisma: PrismaClient = new PrismaClient()) { }

    public async login(email: string): Promise<any> {
        $log.info(`${REPOSITORIES.AUTH}${METHOD.POST}`);
        const user = await this.prisma.user.findFirst({
            where: {
                email
            },
            include: {
                role: true
            }
        });
        $log.debug(`${REPOSITORIES.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
        return user;
    }

    public async register(user: any, hashedPassword: string): Promise<any> {
        $log.info(`${REPOSITORIES.AUTH}${METHOD.POST}`);
        const newUser = await this.prisma.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        });
        $log.debug(`${REPOSITORIES.AUTH} Response:${JSON.stringify(newUser, null, NUMBER.TWO)}`);
        return newUser;
    }

    public async findByEmail(email: string): Promise<any> {
        $log.info(`${REPOSITORIES.AUTH}${METHOD.POST}`);
        const user = await this.prisma.user.findFirst({
            where: { email }
        });
        $log.debug(`${REPOSITORIES.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
        return user;
    }

    public async findByRefreshToken(refreshToken: string): Promise<any> {
        $log.info(`${REPOSITORIES.AUTH}${METHOD.POST}`);
        const user = await this.prisma.user.findFirst({
            where: { refreshToken }
        });
        $log.debug(`${REPOSITORIES.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
        return user;
    }

    public async updateRefreshToken(userId: number, refreshToken: string): Promise<any> {
        $log.info(`${REPOSITORIES.AUTH}${METHOD.POST}`);
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken,
                tokenExpiresAt
            }
        });
        $log.debug(`${REPOSITORIES.AUTH} Response:${JSON.stringify(user, null, NUMBER.TWO)}`);
        return user;
    }
}


