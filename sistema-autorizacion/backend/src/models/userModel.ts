// src/models/userModel.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { encryptData, decryptData } from '../utils/encryption'; // Importar funciones de cifrado
import crypto from 'crypto'; // Asegurarse de usar crypto para generar una apiKey
import redisClient from '../utils/redis'; // Importar cliente Redis
import { removeCircularReferences } from '../utils/jsonSanitizer';

dotenv.config();

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

// Agregar logs de conexión inicial
pool.on('connect', () => logger.info('Nueva conexión al pool de PostgreSQL establecida.'));
pool.on('error', (err) => logger.error('Error en el pool de conexiones de PostgreSQL:', err.message));

// Crear un nuevo usuario en la base de datos (cifrar datos sensibles)
export const createUser = async (nombre: string, email: string, contraseña: string, rol: string) => {
  try {
    logger.info('Datos para crear usuario:', { nombre, email, contraseña, rol });

    // Generar y cifrar la API key
    const apiKey = generateApiKey();
    const encryptedApiKey = await encryptData(apiKey);  // Cifrar la API key antes de almacenarla

    // Log para verificar la longitud de la contraseña cifrada
    logger.info('Contraseña cifrada: ', contraseña); // Verificar la longitud y el valor
    logger.info('Contraseña cifrada (bcrypt): ', contraseña.length); // Verifica la longitud de la contraseña
    logger.info('API Key generada: ', apiKey);

    const query = `
      INSERT INTO usuarios (nombre, email, contraseña, rol, api_key, fecha_registro)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    logger.info('Ejecutando query:', query);
    const result = await pool.query(query, [nombre, email, contraseña, rol, encryptedApiKey]);
    logger.info('Resultado del query:', result.rows[0]);

    // Almacenar apiKey en Redis (clave expirada por un tiempo, TTL)
    await redisClient.setEx(`user:${result.rows[0].id_usuario}:apiKey`, 3600, apiKey);

    return result.rows[0];
  } catch (error: any) {
    logger.error('Error en CREATE USER:', error.message);
    throw error;
  }
};

// Función para generar una apiKey única
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex'); // Genera una clave de 64 caracteres
};


// Buscar un usuario por correo electrónico
export const findUserByEmail = async (email: string) => {
  try {
    logger.info(`Buscando usuario con email: ${email}`);
    const query = 'SELECT * FROM usuarios WHERE email = $1;';
    const result = await pool.query(query, [email]);

    if (!result.rows[0]) {
      logger.warn(`Usuario no encontrado: ${email}`);
      return null;
    }

    logger.info(`Usuario encontrado: ID=${result.rows[0].id_usuario}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error en FIND USER BY EMAIL:', error instanceof Error ? error.message : 'Error desconocido');
    throw error;
  }
};



// Buscar un usuario por ID
export const findUserById = async (id: string) => {
  try {
    const query = 'SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuarios WHERE id_usuario = $1;';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0]; // Devuelve solo los datos necesarios
  } catch (error) {
    console.error(`Error al buscar usuario por ID: ${id}`, error);
    throw error;
  }
};


// Obtener la lista de todos los usuarios (solo para administradores)
export const getAllUsers = async () => {
  try {
    const query = `
      SELECT id_usuario, nombre, email, rol, fecha_registro
      FROM usuarios
      ORDER BY fecha_registro DESC;
    `;
    const result = await pool.query(query);

    // Sanitiza cada usuario antes de retornarlo
    return result.rows.map((user) => removeCircularReferences(user));
  } catch (error: any) {
    logger.error('Error en GET ALL USERS:', error.message);
    throw error;
  }
};


// Actualizar el perfil de un usuario
export const updateUserProfile = async (id: string, updates: { nombre?: string; email?: string; contraseña?: string }) => {
  try {
    logger.info(`Actualizando perfil para el usuario con ID: ${id}`);
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (updates.nombre) {
      fields.push(`nombre = $${index++}`);
      values.push(updates.nombre);
    }
    if (updates.email) {
      fields.push(`email = $${index++}`);
      values.push(updates.email);
    }
    if (updates.contraseña) {
      fields.push(`contraseña = $${index++}`);
      values.push(updates.contraseña);
    }

    values.push(id);
    const query = `
      UPDATE usuarios
      SET ${fields.join(', ')}
      WHERE id_usuario = $${index}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    if (!result.rows[0]) {
      logger.warn(`No se encontró un usuario con el ID: ${id} para actualizar.`);
    }
    logger.info(`Usuario actualizado correctamente: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  } catch (error: any) {
    logger.error('Error en UPDATE USER PROFILE:', error.message);
    throw error;
  }
};

// Actualizar el rol de un usuario
export const updateUserRole = async (id: string, rol: string) => {
  try {
    logger.info(`Actualizando rol del usuario con ID: ${id} a: ${rol}`);
    const query = `
      UPDATE usuarios
      SET rol = $1
      WHERE id_usuario = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [rol, id]);

    if (result.rowCount === 0) {
      logger.warn(`No se encontró un usuario con ID: ${id} para actualizar el rol.`);
      return null;
    }

    logger.info(`Rol actualizado correctamente: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  } catch (error: any) {
    logger.error('Error en UPDATE USER ROLE:', error.message);
    throw error;
  }
};

// Eliminar usuario por ID
export const deleteUser = async (id: string) => {
  try {
    logger.info(`Eliminando usuario con ID: ${id}`);
    const query = 'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      logger.warn(`No se encontró un usuario con ID: ${id} para eliminar.`);
      return null;
    }

    logger.info(`Usuario eliminado correctamente: ${JSON.stringify(result.rows[0])}`);
    return { mensaje: `Usuario con ID ${id} eliminado correctamente.` };
  } catch (error: any) {
    logger.error('Error en DELETE USER:', error.message);
    throw error;
  }
};
