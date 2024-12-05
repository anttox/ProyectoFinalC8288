import pool from '../config';
import logger from '../utils/logger'; // Para registrar logs
import { removeCircularReferences } from '../utils/jsonSanitizer';

export const createLog = async (id_usuario: number, accion: string, ip_origen: string) => {
  try {
    const query = `INSERT INTO logs (id_usuario, accion, ip_origen) VALUES ($1, $2, $3) RETURNING *`;
    const values = [id_usuario, accion, ip_origen];
    const result = await pool.query(query, values);
    logger.info(`Log creado: ${removeCircularReferences(result.rows[0])}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error al crear log:', removeCircularReferences(error));
    throw error;
  }
};

  

export const getLogs = async () => {
  const query = `SELECT * FROM logs ORDER BY fecha_hora DESC`;
  const result = await pool.query(query);
  return result.rows;
};