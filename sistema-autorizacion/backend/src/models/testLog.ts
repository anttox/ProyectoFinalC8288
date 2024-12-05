import { createLog } from './logModel';

const testLog = async () => {
  try {
    const log = await createLog(7, 'Prueba Manual', '127.0.0.1');
    console.log('Log insertado:', log);
  } catch (error: any) { // Usar "any" para evitar el error de tipo
    console.error('Error al insertar log:', error.message);
  }
};

testLog();