import pool from './config';
import logger from './utils/logger';

export const createTables = async () => {
  try {
    logger.info('Verificando conexión a la base de datos...');
    const result = await pool.query('SELECT NOW()');
    logger.info(`Conexión exitosa a la base de datos: ${result.rows[0].now}`);

    logger.info('Iniciando la validación/creación de tablas...');

    // Crear o validar la tabla de usuarios
    logger.info('Validando la tabla "usuarios"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL CHECK (rol IN ('Administrador', 'Operador')),
        fecha_registro TIMESTAMP DEFAULT NOW(),
        api_key VARCHAR(255) UNIQUE
      );
    `);
    logger.info('Tabla "usuarios" validada o creada.');

    // Validar que el campo `api_key` existe
    await pool.query(`
      ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS api_key VARCHAR(255) UNIQUE;
    `);
    logger.info('Campo "api_key" validado o añadido.');

    // Crear o validar la tabla de recursos
    logger.info('Validando la tabla "recursos"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recursos (
        id_recurso SERIAL PRIMARY KEY,
        tipo_recurso VARCHAR(50) NOT NULL,
        configuracion TEXT NOT NULL,
        estado VARCHAR(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo')),
        fecha_creacion TIMESTAMP DEFAULT NOW(),
        id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      );
    `);
    logger.info('Tabla "recursos" validada o creada.');

    // Crear o validar la tabla de logs
    logger.info('Validando la tabla "logs"...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id_log SERIAL PRIMARY KEY,
        id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
        accion TEXT NOT NULL,
        fecha_hora TIMESTAMP DEFAULT NOW(),
        ip_origen VARCHAR(50) NOT NULL
      );
    `);
    logger.info('Tabla "logs" validada o creada.');
  } catch (error: any) {
    logger.error(`Error al crear/validar tablas: ${error.message}`);
    throw error;
  }
};
