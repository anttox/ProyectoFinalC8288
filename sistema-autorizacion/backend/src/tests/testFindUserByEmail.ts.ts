import pool from '../config';

(async () => {
  try {
    const email = 'fernanda.santos@gmail.com'; // Cambia esto si es necesario
    console.log(`Buscando usuario con email: ${email}`);

    const query = 'SELECT * FROM usuarios WHERE email = $1;';
    const result = await pool.query(query, [email]);

    console.log('Resultado de la consulta:', result.rows);
  } catch (error: any) {
    console.error('Error en la consulta:', error.message);
  }
})();
