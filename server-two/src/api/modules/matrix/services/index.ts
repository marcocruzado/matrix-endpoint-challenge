import { $log } from 'ts-log-debug';
import { METHOD, SERVICES } from '../../../../config/common/enums';
import { MatrixStatsRepository } from '../repository';
export class MatrixStatsService {
  constructor(private matrixStatsRepository: MatrixStatsRepository = new MatrixStatsRepository()) {}


  public async getMatrixStats(): Promise<any> {
    $log.info(`${SERVICES.MATRIX}${METHOD.GET}`);
    const matrices = await this.matrixStatsRepository.getMatrices();
    return matrices;
  }


  private findMaxValue(matrices: number[][][]): number {
    return Math.max(...matrices.flatMap(matrix => matrix.flatMap(row => row)));
  }

  private findMinValue(matrices: number[][][]): number {
    return Math.min(...matrices.flatMap(matrix => matrix.flatMap(row => row)));
  }

  private calculateAverage(matrices: number[][][]): number {
    const allNumbers = matrices.flatMap(matrix => matrix.flatMap(row => row));
    const sum = allNumbers.reduce((acc, val) => acc + val, 0);
    return sum / allNumbers.length;
  }

  private calculateSum(matrices: number[][][]): number {
    return matrices.flatMap(matrix => matrix.flatMap(row => row))
      .reduce((acc, val) => acc + val, 0);
  }

  private isDiagonalMatrix(matrix: number[][]): boolean {
    const n = matrix.length;
    const m = matrix[0].length;
    
    // Una matriz diagonal debe ser cuadrada
    if (n !== m) return false;
    
    // Verificar que todos los elementos fuera de la diagonal principal sean 0
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && Math.abs(matrix[i][j]) > 1e-10) {
          return false;
        }
      }
    }
    return true;
  }

  public async processMatrices(data: any): Promise<any> {
    $log.info(`${SERVICES.MATRIX}${METHOD.POST}`);
    
    const { matrices } = data;
    const allMatrices = [
      matrices.original,
      matrices.rotated,
      matrices.qMatrix,
      matrices.rMatrix
    ];

    // Calcular estadísticas
    const stats = {
      original: matrices.original,
      rotated: matrices.rotated,
      qMatrix: matrices.qMatrix,
      rMatrix: matrices.rMatrix,
      maxValue: this.findMaxValue(allMatrices),
      minValue: this.findMinValue(allMatrices),
      average: this.calculateAverage(allMatrices),
      totalSum: this.calculateSum(allMatrices),
      isDiagonal: {
        original: this.isDiagonalMatrix(matrices.original),
        rotated: this.isDiagonalMatrix(matrices.rotated),
        qMatrix: this.isDiagonalMatrix(matrices.qMatrix),
        rMatrix: this.isDiagonalMatrix(matrices.rMatrix)
      }
    };
    
    // Guardar en la base de datos
    const savedStats = await this.matrixStatsRepository.createMatrixStats(stats);
    
    $log.debug(`${SERVICES.MATRIX}${METHOD.POST} Response:${JSON.stringify(savedStats)}`);
    return savedStats;
  }
}
