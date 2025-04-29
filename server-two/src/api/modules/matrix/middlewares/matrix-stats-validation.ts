import { NextFunction, Request, Response } from 'express';
import { $log } from 'ts-log-debug';
import { errorHandler } from '../../../../middlewares/errorHandler';

interface MatrixValidationError {
  message: string;
  matrixName?: string;
  details?: string;
}

export const matrixStatsValidation = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { matrices } = req.body;

    // Validar que el objeto matrices exista
    if (!matrices) {
      throw createError('El objeto matrices es requerido');
    }

    // Validar que sea un objeto
    if (typeof matrices !== 'object' || matrices === null) {
      throw createError('El objeto matrices debe ser un objeto válido');
    }

    // Lista de matrices requeridas
    const requiredMatrices = ['original', 'rotated', 'qMatrix', 'rMatrix'];

    // Validar que todas las matrices requeridas existan
    for (const matrixName of requiredMatrices) {
      validateMatrix(matrices[matrixName], matrixName);
    }

    next();
  } catch (error) {
    const err = error as MatrixValidationError;
    const errorMessage = err.matrixName 
      ? `Error en la matriz ${err.matrixName}: ${err.message}${err.details ? ` (${err.details})` : ''}`
      : err.message;
    
    $log.error(`Error en la validación de matrices: ${errorMessage}`);
    errorHandler(new Error(errorMessage), req, res, next);
  }
};

function validateMatrix(matrix: any, matrixName: string): void {
  // Validar que la matriz exista
  if (!matrix) {
    throw createError(`La matriz ${matrixName} es requerida`, matrixName);
  }

  // Validar que sea un array
  if (!Array.isArray(matrix)) {
    throw createError('Debe ser un array', matrixName);
  }

  // Validar que no esté vacía
  if (matrix.length === 0) {
    throw createError('No puede estar vacía', matrixName);
  }

  // Validar que todas las filas sean arrays
  if (!matrix.every(row => Array.isArray(row))) {
    throw createError('Todas las filas deben ser arrays', matrixName);
  }

  // Validar que todas las filas tengan elementos
  if (matrix.some(row => row.length === 0)) {
    throw createError('Las filas no pueden estar vacías', matrixName);
  }

  // Validar que sea rectangular (todas las filas tengan el mismo número de columnas)
  const firstRowLength = matrix[0].length;
  if (!matrix.every(row => row.length === firstRowLength)) {
    throw createError(
      'Debe ser rectangular',
      matrixName,
      'todas las filas deben tener el mismo número de columnas'
    );
  }

  // Validar que todos los elementos sean números
  if (!matrix.every(row => row.every(element => 
    typeof element === 'number' && !isNaN(element) && isFinite(element)
  ))) {
    throw createError(
      'Todos los elementos deben ser números válidos',
      matrixName,
      'no se permiten NaN, Infinity o valores no numéricos'
    );
  }
}

function createError(message: string, matrixName?: string, details?: string): MatrixValidationError {
  return {
    message,
    matrixName,
    details
  };
}

