import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './utils/logger'; // Para registrar logs
import { removeCircularReferences } from './utils/jsonSanitizer';

// Cargar explícitamente el archivo .env.local
dotenv.config({ path: '.env.local' });


// Validar variables de entorno requeridas
const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_HOST', 'DB_NAME', 'DB_PORT'];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`Falta la variable de entorno: ${key}`);
    throw new Error(`Falta la variable de entorno: ${key}`);
  } else {
    logger.info(`Variable de entorno ${key} cargada correctamente`);
  }
});

// Validar DB_PASS
if (typeof process.env.DB_PASS !== 'string' || !process.env.DB_PASS.trim()) {
  throw new Error('La variable de entorno DB_PASS no está configurada correctamente.');
}
// Depuración de variables de entorno
logger.info(`DB_PASS utilizado en la conexión: ${process.env.DB_PASS}`);
logger.info(`Tipo de DB_PASS: ${typeof process.env.DB_PASS}`);

// Crear el pool de conexiones
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: `${process.env.DB_PASS}`, // Forzar a string
  port: Number(process.env.DB_PORT),
  ssl: false, // Asegurarse de que no haya problemas con SSL
  max: 10, // Número máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo de inactividad antes de cerrar la conexión
  connectionTimeoutMillis: 2000, // Tiempo máximo para intentar conectar antes de fallar
});

// Logs de eventos del pool
pool.on('acquire', () => logger.info('Cliente adquirido del pool.'));
pool.on('release', () => logger.info('Cliente liberado al pool.'));
pool.on('error', (err) => logger.error('Error en el pool de conexiones:', err.message));

// Agregar logs para depuración
console.log('Configuración del Pool:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Manejo de errores del pool
pool.on('error', (err) => {
  logger.error('Error en el pool de conexiones:', removeCircularReferences(err));
});

(async () => {
  try {
    const client = await pool.connect();
    logger.info('Conexión inicial a PostgreSQL exitosa.');
    client.release();
  } catch (err: any) {
    logger.error('Error en la conexión inicial a PostgreSQL:', removeCircularReferences(err));
  }
})();

// Log de conexión exitosa al crear el pool
logger.info('Pool de conexiones de PostgreSQL creado correctamente.');

// Probar la conexión inicial
(async () => {
  try {
    const client = await pool.connect();
    logger.info('Conexión inicial a PostgreSQL exitosa.');
    client.release();
  } catch (err: any) {
    logger.error('Error en la conexión inicial a PostgreSQL:', err.message);
  }
})();

// Exportar el pool para usarlo en otras partes del proyecto
export default pool;
