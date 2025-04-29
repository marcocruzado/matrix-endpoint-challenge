import { $log } from 'ts-log-debug';
import { PrismaClient } from '@prisma/client';
import { METHOD, REPOSITORIES } from '../../../../config/common/enums';

export class CreationMatrixRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}


  public async createMatrix(data: any): Promise<any> {
    $log.info(`${REPOSITORIES.MATRIX}${METHOD.POST}`);
    const matrixCreate = await this.prisma.matrix.create({
      data: {
        original: data.original,
        rotated: data.rotated,
        qMatrix: data.qMatrix,
        rMatrix: data.rMatrix,
      },
    });
    return matrixCreate;
  }
}
