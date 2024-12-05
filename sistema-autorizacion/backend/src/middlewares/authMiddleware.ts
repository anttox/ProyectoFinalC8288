// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../utils/logger';
import { removeCircularReferences } from '../utils/jsonSanitizer';

interface DecodedToken extends JwtPayload {
  id: number;
  rol: string;
}

interface CustomRequest extends Request {
  user?: DecodedToken;
  clientIp?: string;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  logger.info('[authMiddleware] Token recibido:', token || 'Token no proporcionado');

  if (!token) {
    logger.warn('[authMiddleware] Acceso denegado. Token no proporcionado.');
    res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded;

    req.clientIp = req.header('x-forwarded-for') || req.socket.remoteAddress || 'IP no disponible';

    logger.info('[authMiddleware] Token decodificado:', removeCircularReferences(req.user));
    logger.info('[authMiddleware] IP del cliente:', req.clientIp);

    next(); // Continúa al siguiente middleware
  } catch (error) {
    logger.error('[authMiddleware] Error al verificar el token:', removeCircularReferences(error));
    res.status(400).json({ mensaje: 'Token inválido.' });
  }
};


export default authMiddleware;

