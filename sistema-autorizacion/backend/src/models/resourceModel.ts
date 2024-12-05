import pool from '../config'; // Importa el pool de conexiones
import logger from '../utils/logger'; // Para registrar logs
import { removeCircularReferences } from '../utils/jsonSanitizer';

// Crear un nuevo recurso asociado a un usuario
export const createResource = async (tipo: string, configuracion: string, estado: string, id_usuario: number) => {
  try {
    const query = `
      INSERT INTO recursos (tipo_recurso, configuracion, estado, id_usuario, fecha_creacion)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const result = await pool.query(query, [tipo, configuracion, estado, id_usuario]);
    logger.info(`Recurso creado: ${removeCircularReferences(result.rows[0])}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error al crear recurso:', removeCircularReferences(error));
    throw new Error('Error al crear recurso en la base de datos');
  }
};


// Obtener todos los recursos con filtros opcionales
export const getAllResources = async (filters: { tipo?: string; estado?: string } = {}) => {
  const { tipo, estado } = filters;
  let query = `SELECT * FROM recursos WHERE 1=1`;
  const params: any[] = [];

  if (tipo) {
    params.push(tipo);
    query += ` AND tipo_recurso = $${params.length}`;
  }

  if (estado) {
    params.push(estado);
    query += ` AND estado = $${params.length}`;
  }

  query += ` ORDER BY fecha_creacion DESC`;

  try {
    const result = await pool.query(query, params);
    logger.info(`Recursos obtenidos: ${result.rowCount}`);
    return result.rows;
  } catch (error) {
    logger.error('Error al ejecutar la consulta de obtención de recursos:', error);
    throw new Error('Error al obtener recursos de la base de datos');
  }
};

// Actualizar un recurso
export const updateResource = async (id: string, updates: { tipo?: string; configuracion?: string; estado?: string }) => {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (updates.tipo) {
      fields.push(`tipo_recurso = $${index++}`);
      values.push(updates.tipo);
    }
    if (updates.configuracion) {
      fields.push(`configuracion = $${index++}`);
      values.push(updates.configuracion);
    }
    if (updates.estado) {
      fields.push(`estado = $${index++}`);
      values.push(updates.estado);
    }

    values.push(id);
    const query = `
      UPDATE recursos
      SET ${fields.join(', ')}
      WHERE id_recurso = $${index}
      RETURNING *;
    `;
    const result = await pool.query(query, values);

    logger.info(`Recurso actualizado en la base de datos: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error al ejecutar la consulta de actualización de recurso:', error);
    throw new Error('Error al actualizar recurso en la base de datos');
  }
};

// Eliminar un recurso
export const deleteResource = async (id: string) => {
  try {
    const query = `DELETE FROM recursos WHERE id_recurso = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);

    logger.info(`Recurso eliminado de la base de datos: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error al ejecutar la consulta de eliminación de recurso:', error);
    throw new Error('Error al eliminar recurso en la base de datos');
  }
};