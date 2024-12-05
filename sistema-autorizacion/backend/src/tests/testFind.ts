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
      const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', ['fernanda.santos@gmail.com']);
      console.log('Resultado de prueba:', result.rows);
    } catch (error: any) {
      console.error('Error en la consulta directa:', error.message);
    }
  })();
  