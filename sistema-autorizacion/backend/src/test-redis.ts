import redisClient from './utils/redis';
import logger from './utils/logger';

(async () => {
  try {
    logger.info('Conectando a Redis...');
    await redisClient.set('test-key', 'test-value');
    const value = await redisClient.get('test-key');
    logger.info(`Conexión a Redis exitosa. Valor: ${value}`);
    process.exit(0); // Salida exitosa
  } catch (error: any) {
    logger.error(`Error al conectar a Redis: ${error.message}`);
    process.exit(1); // Salida con error
  }
})();
