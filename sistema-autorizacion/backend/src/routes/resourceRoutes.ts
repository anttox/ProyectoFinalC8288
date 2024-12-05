import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import checkRole from '../middlewares/checkRole';
import {
  createResourceController,
  getAllResourcesController,
  updateResourceController,
  deleteResourceController,
} from '../controllers/resourceController';

const router = express.Router();

// Ruta para obtener todos los recursos
router.get('/', (req, res, next) => {
  console.log('[GET /resources] Headers:', req.headers);
  console.log('[GET /resources] User:', req.user);
  console.log('[GET /resources] IP Address:', req.ip);
  next();
}, authMiddleware, checkRole(['Operador', 'Administrador']), async (req, res) => {
  console.log('[Request] GET /resources Query Params:', req.query);
  await getAllResourcesController(req, res);
});

// Ruta para crear un recurso
router.post('/', authMiddleware, checkRole(['Operador', 'Administrador']), async (req, res) => {
  console.log('[Request] POST /resources', req.body);
  await createResourceController(req, res);
});

// Ruta para actualizar un recurso
router.put('/:id', authMiddleware, checkRole(['Operador', 'Administrador']), async (req, res) => {
  console.log('[Request] PUT /resources/:id', req.params.id, req.body);
  await updateResourceController(req, res);
});

// Ruta para eliminar un recurso
router.delete('/:id', authMiddleware, checkRole(['Operador', 'Administrador']), async (req, res) => {
  console.log('[Request] DELETE /resources/:id', req.params.id);
  await deleteResourceController(req, res);
});

export default router;
