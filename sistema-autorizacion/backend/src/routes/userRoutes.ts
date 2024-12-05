import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import checkRole from '../middlewares/checkRole';
import { 
  getUserProfile, 
  getAllUsersController, 
  updateUserProfileController, 
  deleteUserController,
  updateUserRoleController 
} from '../controllers/userController';
import logger from '../utils/logger';
import { removeCircularReferences } from '../utils/jsonSanitizer';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  logger.info('[GET /profile] Request Headers:', removeCircularReferences(req.headers));
  logger.info('[GET /profile] Decoded User from Token:', removeCircularReferences(req.user));

  try {
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('[GET /profile] Usuario no autenticado');
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const user = await getUserProfile(req, res);
    if (!user) return; // Evita enviar múltiples respuestas

    res.status(200).json(removeCircularReferences(user));
  } catch (error: any) {
    logger.error('[GET /profile] Error al obtener perfil del usuario:', removeCircularReferences(error));
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
});

router.get('/admin/users', authMiddleware, checkRole(['Administrador']), async (req, res) => {
  try {
    const users = await getAllUsersController(req, res);
    res.status(200).json(removeCircularReferences(users));
  } catch (error: any) {
    logger.error('[GET /admin/users] Error:', removeCircularReferences(error));
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
});

router.put('/profile', authMiddleware, updateUserProfileController);

router.put('/:id/role', authMiddleware, checkRole(['Administrador']), async (req, res) => {
  logger.info('[PUT /:id/role] Actualizando rol para ID:', req.params.id);
  try {
    await updateUserRoleController(req, res);
  } catch (error: any) {
    logger.error('[PUT /:id/role] Error al actualizar rol:', removeCircularReferences(error));
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
});

router.delete('/:id', authMiddleware, checkRole(['Administrador']), async (req, res) => {
  logger.info('[DELETE /:id] Eliminando usuario con ID:', req.params.id);
  try {
    await deleteUserController(req, res);
  } catch (error: any) {
    logger.error('[DELETE /:id] Error al eliminar usuario:', removeCircularReferences(error));
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
});

export default router;

