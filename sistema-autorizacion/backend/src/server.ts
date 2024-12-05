// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import resourceRoutes from './routes/resourceRoutes';
import logRoutes from './routes/logRoutes';
import logAction from './middlewares/logMiddleware';
import authMiddleware from './middlewares/authMiddleware';
import errorHandler from './middlewares/errorHandler';
import pool from './config';
import { createTables } from './init-db';
import logger from './utils/logger';
import redisClient from './utils/redis';
import { removeCircularReferences } from './utils/jsonSanitizer';

// Seleccionar el archivo .env según el entorno
dotenv.config({ path: '.env.local' });
logger.info('Archivo de entorno cargado: .env.local');

// Inicialización del servidor Express
const app = express();
app.use(bodyParser.json());
logger.info('Middleware bodyParser configurado para manejar JSON.');

// Usar Helmet para mejorar la seguridad de las cabeceras HTTP
app.use(helmet());
logger.info('Helmet configurado para proteger las cabeceras HTTP.');

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:4000', 'https://localhost:4000'], // Origen permitido
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
logger.info('CORS configurado correctamente.');

// Middleware para manejar solicitudes OPTIONS específicas a /api/resources
app.options('*', (req, res) => {
    logger.info(`CORS OPTIONS request: ${req.url}`);
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204); // Responde sin contenido
});
logger.info('Middleware OPTIONS configurado globalmente');

// Middleware para agregar cabeceras CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Middleware temporal para depuración
app.use((req, res, next) => {
    logger.info(`[Server] Solicitud entrante: ${req.method} ${req.originalUrl}`);
    logger.debug('Headers:', req.headers);
    next();
});

// Middleware JSON
app.use(express.json());
logger.info('Middleware JSON configurado correctamente.');

// Rutas base y de autenticación
app.get('/', (req: Request, res: Response) => {
    logger.info('Ruta base "/" accedida.');
    res.send({ mensaje: 'Servidor corriendo correctamente' });
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Configuración de rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, logAction, userRoutes);
app.use('/api/resources', authMiddleware, logAction, resourceRoutes);
app.use('/api/logs', authMiddleware, logRoutes);
logger.info('Rutas principales configuradas.');

// Manejo de errores
app.use(errorHandler);

// Ruta no encontrada (404)
app.use((req: Request, res: Response) => {
    logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Inicializar la base de datos y crear tablas si no existen
(async () => {
    try {
        logger.info('Iniciando la creación de tablas...');
        await createTables();
        logger.info('Tablas creadas y validadas correctamente.');
    } catch (error: any) {
        logger.error('Error al crear tablas:', error.message);
    }
})();

// Probar conexión a PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        logger.error('Error al conectar a PostgreSQL:', err.message);
    } else {
        logger.info('Conexión exitosa a PostgreSQL.');
    }
    release();
});

// Configurar servidor con HTTPS o HTTP según el entorno
const useHttps = process.env.NODE_ENV === 'production' || process.env.USE_HTTPS_LOCAL === 'true';
const port = process.env.PORT_BACKEND || 3000;

// Agrega los logs para depurar las variables de entorno relevantes
logger.info(`USE_HTTPS_LOCAL: ${process.env.USE_HTTPS_LOCAL}`);
logger.info(`SSL_KEY_PATH: ${process.env.SSL_KEY_PATH}`);
logger.info(`SSL_CERT_PATH: ${process.env.SSL_CERT_PATH}`);
logger.info(`PORT_BACKEND: ${port}`); // Ahora la variable 'port' está definida y no generará error.

if (useHttps) {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY_PATH!),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
    };
    https.createServer(options, app).listen(port, () => {
        logger.info(`Servidor HTTPS corriendo en el puerto ${port}`);
        console.log(`Servidor HTTPS corriendo en el puerto ${port}`); // Extra debug
    });
} else {
    app.listen(port, () => {
        logger.info(`Servidor HTTP corriendo en el puerto ${port}`);
        console.log(`Servidor HTTP corriendo en el puerto ${port}`); // Extra debug
    });
}

// Manejar cierre del servidor y desconexión de Redis
process.on('SIGINT', async () => {
    logger.info('Cerrando cliente Redis...');
    await redisClient.disconnect();
    logger.info('Cliente Redis cerrado correctamente.');
    process.exit(0);
});

// Manejo global de errores no capturados
// Agregar logs para manejar promesas y excepciones no capturadas
process.on('uncaughtException', (error) => {
    logger.error(`Excepción no capturada: ${removeCircularReferences(error)}`);
    process.exit(1);
});
  
  process.on('unhandledRejection', (reason) => {
    logger.error(`Promesa no manejada: ${removeCircularReferences(reason)}`);
    process.exit(1);
});
 
export default app;
