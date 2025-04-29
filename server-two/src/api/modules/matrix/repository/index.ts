import { $log } from 'ts-log-debug';
import { PrismaClient } from '@prisma/client';
import { METHOD, REPOSITORIES } from '../../../../config/common/enums';

export class MatrixStatsRepository {
  constructor(private prisma: PrismaClient = new PrismaClient()) {}

  public async createMatrixStats(data: any): Promise<any> {
    $log.info(`${REPOSITORIES.MATRIX}${METHOD.POST}`);
    const statsCreate = await this.prisma.matrixStats.create({
      data: {
        original: data.original,
        rotated: data.rotated,
        qMatrix: data.qMatrix,
        rMatrix: data.rMatrix,
        maxValue: data.maxValue,
        minValue: data.minValue,
        average: data.average,
        totalSum: data.totalSum,
        isDiagonal: data.isDiagonal
      },
    });
    return statsCreate;
  }
}
