import { Request, Response, NextFunction } from 'express';
import { createLog } from '../models/logModel';
import logger from '../utils/logger';
import { removeCircularReferences } from '../utils/jsonSanitizer';

interface CustomRequest extends Request {
  user?: { id: number; rol: string };
  clientIp?: string;
}

const logAction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user) {
    const { id } = req.user;
    const ipAddress = req.clientIp || req.header('x-forwarded-for') || req.socket.remoteAddress || 'IP desconocida';
    const action = `${req.method} ${req.originalUrl}`;

    try {
      const log = await createLog(id, action, ipAddress);
      logger.info(`Log registrado: ${removeCircularReferences(log)}`);
    } catch (error) {
      logger.error('Error al registrar log:', removeCircularReferences(error));
    }
  } else {
    console.error('[logAction] req.user no está definido.');
  }
  next();
};

export default logAction;
