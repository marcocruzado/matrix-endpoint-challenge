import { NextFunction, Request, Response } from 'express';
import { $log } from 'ts-log-debug';
import { errorHandler } from '../../../../middlewares/errorHandler';


  
export const createMatrixValidationHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { matrix } = req.body;

    // Existe la matriz
    if (!matrix) {
      throw new Error('La matriz es requerida');
    }

    // Es un array
    if (!Array.isArray(matrix)) {
      throw new Error('La matriz debe ser un array');
    }

    // Es un array de arrays
    if (!matrix.every(row => Array.isArray(row))) {
      throw new Error('Cada fila de la matriz debe ser un array');
    }

    // Es un array de números
    if (!matrix.every(row => row.every(element => typeof element === 'number'))) {
      throw new Error('Todos los elementos de la matriz deben ser números');
    }

    // Es una matriz rectangular (todas las filas tengan el mismo número de columnas)
    const numColumns = matrix[0].length;
    if (!matrix.every(row => row.length === numColumns)) {
      throw new Error('La matriz debe ser rectangular (todas las filas deben tener el mismo número de columnas)');
    }

    next();
  } catch (error) {
    $log.error(`Error en la validación de la matriz: ${error}`);
    errorHandler(error, req, res, next);
  }
};

