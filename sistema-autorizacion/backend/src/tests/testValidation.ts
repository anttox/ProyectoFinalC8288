import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'baselisto',
  password: 'Cayetano123',
  port: 5432,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión exitosa usando valores explícitos');
    const result = await client.query('SELECT NOW()');
    console.log('Resultado de prueba:', result.rows);
    client.release();
  } catch (error: any) {
    console.error('Error en la conexión explícita:', error.message);
  }
})();
