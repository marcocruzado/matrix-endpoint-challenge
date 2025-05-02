import { $log } from 'ts-log-debug';
import { METHOD, SERVICES } from '../../../../config/common/enums';
import { CreationMatrixRepository } from '../repository';
import { Matrix, QrDecomposition } from 'ml-matrix';
import axios from 'axios';

export class CreationMatrixServices {
  constructor(
    private creationMatrixRepository: CreationMatrixRepository = new CreationMatrixRepository(),
    private secondApiUrl: string = process.env.URL_SERVER_TWO || 'http://localhost:3001/api/v1/server-2/matrix-stats/stadistics'
  ) {}

  private rotateMatrix(matrix: number[][]): number[][] {
    const n = matrix.length;
    const m = matrix[0].length;
    const rotated = Array(m).fill(0).map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        rotated[j][n - 1 - i] = matrix[i][j];
      }
    }
    
    return rotated;
  }

  public async createMatrix(data: any): Promise<any> {
    $log.info(`${SERVICES.MATRIX}${METHOD.POST}`);
    
    const inputMatrix = new Matrix(data.matrix);
    
    const qr = new QrDecomposition(inputMatrix);
    const Q = qr.orthogonalMatrix;
    const R = qr.upperTriangularMatrix;

    const rotatedMatrix = this.rotateMatrix(data.matrix);
    
    const response = {
      original: data.matrix,
      rotated: rotatedMatrix,
      qMatrix: Q.to2DArray(),
      rMatrix: R.to2DArray()
    };
    
    const savedMatrix = await this.creationMatrixRepository.createMatrix(response);

    try {
      const secondApiResponse = await axios.post(this.secondApiUrl, {
        matrices: {
          original: response.original,
          rotated: response.rotated,
          qMatrix: response.qMatrix,
          rMatrix: response.rMatrix
        }
      });
      
      return {
        ...savedMatrix,
        statistics: secondApiResponse.data
      };
    } catch (error) {
      $log.error(`Error al enviar datos a la segunda API: ${error}`);
      return savedMatrix;
    }
  }
}
