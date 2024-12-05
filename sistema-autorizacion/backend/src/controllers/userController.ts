// src/controllers/userController.ts
import { Request, Response } from 'express';
import { findUserById, getAllUsers, updateUserProfile, deleteUser, updateUserRole } from '../models/userModel';
import logger from '../utils/logger';
import { removeCircularReferences } from '../utils/jsonSanitizer';

export const getUserProfile = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      logger.warn('[GET /profile] Usuario no autenticado.');
      return res.status(401).json({ mensaje: 'Usuario no autenticado.' });
    }

    const user = await findUserById(userId.toString());
    if (!user) {
      logger.warn(`[GET /profile] Usuario con ID ${userId} no encontrado.`);
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const sanitizedUser = removeCircularReferences(user);
    logger.info(`[GET /profile] Perfil obtenido para el usuario con ID ${userId}.`);

    // Devuelve la respuesta y detiene la ejecución
    return res.status(200).json(sanitizedUser);
  } catch (error: any) {
    // Verifica si el error realmente contiene información antes de registrarlo
    if (error) {
      logger.error('[GET /profile] Error al obtener el perfil del usuario:', removeCircularReferences(error));
    } else {
      logger.error('[GET /profile] Error al obtener el perfil del usuario: Error desconocido');
    }

    // Evita enviar múltiples respuestas
    if (!res.headersSent) {
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
};


export const getAllUsersController = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    if (req.user?.rol !== 'Administrador') {
      console.log('Acceso denegado: el usuario no tiene rol de Administrador.');
      return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de Administrador.' });
    }

    const users = await getAllUsers();
    const sanitizedUsers = removeCircularReferences(users);

    return res.status(200).json(sanitizedUsers);
  } catch (error: any) {
    console.error('[GET /admin/users] Error al obtener usuarios:', error.message);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const updateUserProfileController = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const updatedUser = await updateUserProfile(userId.toString(), updates);

    if (!updatedUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const sanitizedUser = removeCircularReferences(updatedUser);
    return res.status(200).json({ mensaje: 'Perfil actualizado correctamente', usuario: sanitizedUser });
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error.message);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;

    if (req.user?.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores pueden eliminar usuarios.' });
    }

    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error.message);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

export const updateUserRoleController = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (req.user?.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo Administradores pueden cambiar roles.' });
    }

    if (!rol || (rol !== 'Administrador' && rol !== 'Operador')) {
      return res.status(400).json({ mensaje: 'Rol inválido. Debe ser "Administrador" o "Operador".' });
    }

    const updatedUser = await updateUserRole(id, rol);

    if (!updatedUser) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const sanitizedUser = removeCircularReferences(updatedUser);
    return res.status(200).json({ mensaje: 'Rol actualizado correctamente.', usuario: sanitizedUser });
  } catch (error: any) {
    console.error('Error al actualizar rol:', error.message);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};
