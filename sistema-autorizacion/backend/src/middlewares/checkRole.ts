// src/middlewares/checkRole.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtil';
import { removeCircularReferences } from '../utils/jsonSanitizer';

interface CustomRequest extends Request {
  user?: {
    id: number;
    rol: string;
  };
}

const checkRole = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'Falta el token de autorización.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ mensaje: 'Token no válido o faltante.' });
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded as { id: number; rol: string };

      const { rol } = req.user;

      if (!allowedRoles.includes(rol)) {
        return res.status(403).json({
          mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
        });
      }

      console.log('[checkRole] Usuario autorizado:', removeCircularReferences(req.user));
      next();
    } catch (error) {
      console.error('[checkRole] Error:', removeCircularReferences(error));
      return res.status(403).json({ mensaje: 'Token no válido.' });
    }
  };
};

export default checkRole;
