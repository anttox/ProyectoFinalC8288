import { Request, Response } from 'express';
import { createResource, getAllResources, updateResource, deleteResource } from '../models/resourceModel';
import logger from '../utils/logger';
import { removeCircularReferences } from '../utils/jsonSanitizer';

export const createResourceController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo_recurso, configuracion, estado } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      logger.warn('Usuario no autenticado intentando crear un recurso.');
      return res.status(401).json({ mensaje: 'Usuario no autenticado.' });
    }

    if (!tipo_recurso || !configuracion || !estado) {
      logger.warn('Datos incompletos enviados al crear recurso.');
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const resource = await createResource(tipo_recurso, configuracion, estado, userId);
    logger.info(`Recurso creado correctamente: ${removeCircularReferences(resource)}`);
    return res.status(201).json({ mensaje: 'Recurso creado correctamente.', recurso: resource });
  } catch (error) {
    logger.error('Error al crear recurso:', removeCircularReferences(error));
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};


// Controlador para obtener todos los recursos con filtros
export const getAllResourcesController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { tipo_recurso, estado, configuracion } = req.query;

    const filters = {
      tipo_recurso: tipo_recurso ? String(tipo_recurso) : undefined,
      estado: estado ? String(estado) : undefined,
      configuracion: configuracion ? String(configuracion) : undefined,
    };

    const resources = await getAllResources(filters);

    if (!resources || resources.length === 0) {
      logger.info('No se encontraron recursos con los filtros proporcionados.');
      return res.status(404).json({ mensaje: 'No se encontraron recursos.' });
    }

    logger.info('Recursos filtrados obtenidos correctamente.');
    return res.status(200).json(resources);
  } catch (error) {
    logger.error('Error al obtener los recursos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Controlador para actualizar un recurso
export const updateResourceController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates.tipo_recurso && !updates.configuracion && !updates.estado) {
      logger.warn(`No se proporcionaron datos para actualizar el recurso con ID ${id}.`);
      return res.status(400).json({ mensaje: 'Se requiere al menos un campo para actualizar el recurso.' });
    }

    const updatedResource = await updateResource(id, updates);

    if (!updatedResource) {
      logger.warn(`Recurso con ID ${id} no encontrado.`);
      return res.status(404).json({ mensaje: 'Recurso no encontrado.' });
    }

    logger.info(`Recurso con ID ${id} actualizado correctamente.`);
    return res.status(200).json({ mensaje: 'Recurso actualizado correctamente.', recurso: updatedResource });
  } catch (error) {
    logger.error('Error al actualizar recurso:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// Controlador para eliminar un recurso
export const deleteResourceController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedResource = await deleteResource(id);

    if (!deletedResource) {
      logger.warn(`Recurso con ID ${id} no encontrado para eliminación.`);
      return res.status(404).json({ mensaje: 'Recurso no encontrado.' });
    }

    logger.info(`Recurso con ID ${id} eliminado correctamente.`);
    return res.status(200).json({ mensaje: 'Recurso eliminado correctamente.', recurso: deletedResource });
  } catch (error) {
    logger.error('Error al eliminar recurso:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};