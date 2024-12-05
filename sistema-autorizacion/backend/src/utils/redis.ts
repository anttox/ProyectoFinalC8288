// src/utils/redis.ts
import { createClient } from 'redis'; // Usar la nueva forma de crear cliente en node-redis v4.x
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

// Configuración de Redis
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6380}`,  // Usar la propiedad 'url' en lugar de 'host'
  password: process.env.REDIS_PASSWORD || 'Contraseña',  // Si es necesario agregar contraseña
});

// Manejo de eventos
redisClient.on('error', (err) => {
  logger.error('Error en la conexión con Redis:', err);
});
redisClient.on('connect', () => {
  logger.info('Conexión exitosa a Redis.');
});
redisClient.on('ready', () => logger.info('Cliente Redis listo para usar.'));
redisClient.on('end', () => logger.info('Cliente Redis desconectado.'));

// Asegurarse de conectar Redis al inicio
(async () => {
  try {
    if (!redisClient.isOpen) {
      logger.info('Conectando al Cliente Redis...');
      await redisClient.connect();
      logger.info('Cliente Redis conectado correctamente.');
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error al conectar Redis: ${err.message}`);
    } else {
      logger.error('Error desconocido al conectar Redis');
    }
  }
})();

export default redisClient;
