import { Request, Response, NextFunction } from 'express';
import { removeCircularReferences } from '../utils/jsonSanitizer';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[errorHandler] Stack:', removeCircularReferences(err.stack));
  res.status(500).json({
    mensaje: 'Error interno del servidor',
    detalle: removeCircularReferences(err.message),
  });
};

export default errorHandler;
