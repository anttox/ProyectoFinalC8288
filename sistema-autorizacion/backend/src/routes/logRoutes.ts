import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { getLogs } from '../models/logModel';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  if (req.user?.rol !== 'Administrador') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores pueden consultar los logs.' });
  }

  try {
    const logs = await getLogs();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener logs' });
  }
});

export default router;