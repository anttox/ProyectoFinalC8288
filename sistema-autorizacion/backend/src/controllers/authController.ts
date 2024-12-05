// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel';
import logger from '../utils/logger';
import redisClient from '../utils/redis';
import { removeCircularReferences } from '../utils/jsonSanitizer';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Inicio del registro de usuario');
    const { nombre, email, contraseña, rol } = req.body;

    if (!contraseña || contraseña.trim() === '') {
      logger.error('Contraseña vacía en la solicitud');
      res.status(400).json({ mensaje: 'La contraseña es obligatoria.' });
      return;
    }

    if (!nombre || !email || !rol) {
      logger.warn('Faltan campos obligatorios en el registro.');
      res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    logger.info(`Datos recibidos: ${removeCircularReferences({ nombre, email: normalizedEmail, rol })}`);

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      logger.warn(`El correo ${normalizedEmail} ya está registrado.`);
      res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(contraseña, 12);
    logger.info('Contraseña cifrada correctamente.');

    const user = await createUser(nombre, normalizedEmail, hashedPassword, rol);
    logger.info(`Usuario creado exitosamente: ${removeCircularReferences(user)}`);
    res.status(201).json(user);
  } catch (error: any) {
    logger.error('Error al registrar el usuario:', removeCircularReferences(error));
    res.status(500).json({ mensaje: 'Error al registrar el usuario.', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Inicio de sesión de usuario.');
    const { email, contraseña } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    logger.info(`Verificando usuario con email: ${normalizedEmail}`);
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
      logger.warn(`Usuario no encontrado: ${normalizedEmail}`);
      res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      logger.warn(`Contraseña incorrecta para el usuario: ${normalizedEmail}`);
      res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
      return;
    }

    if (!redisClient.isOpen) {
      logger.error('El cliente Redis no está conectado.');
      throw new Error('El cliente Redis no está conectado.');
    }
    const cachedToken = await redisClient.get(`user:${user.id_usuario}:jwtToken`);
    if (cachedToken) {
      logger.info(`Token JWT encontrado en caché para ${normalizedEmail}`);
      res.json({ token: cachedToken });
      return;
    }

    const token = jwt.sign({ id: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    logger.info('Token JWT generado exitosamente.');

    await redisClient.setEx(`user:${user.id_usuario}:jwtToken`, 3600, token);

    res.json({ token });
  } catch (error: any) {
    logger.error('Error al iniciar sesión:', removeCircularReferences(error));
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error: error.message });
  }
};

export default { registerUser, loginUser };
