import { createLogger, format, transports } from 'winston';
import path from 'path';
import { removeCircularReferences } from './jsonSanitizer';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      const sanitizedMessage = removeCircularReferences(message || 'Error desconocido'); // Maneja mensajes vacíos
      return stack
        ? `${timestamp} [${level.toUpperCase()}]: ${sanitizedMessage} - ${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${sanitizedMessage}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join('logs', 'errors.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
});

process.on('unhandledRejection', (reason: any) => {
  logger.error(`Unhandled Rejection: ${removeCircularReferences(reason || 'Razón desconocida')}`);
});

export default logger;
