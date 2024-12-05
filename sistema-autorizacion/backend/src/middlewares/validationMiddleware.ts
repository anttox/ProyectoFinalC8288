// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express'; // Importar los tipos correctamente
import { body, validationResult } from 'express-validator';  // Usar express-validator para validaciones

// Middleware para validar los datos de entrada de las solicitudes usando express-validator
export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un correo válido')
    .normalizeEmail(),  // Normaliza el correo electrónico
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Middleware para verificar si las validaciones de express-validator han producido errores
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);  // Verificar errores
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });  // Si hay errores, retornarlos
  }
  next();  // Si no hay errores, continuar con la siguiente acción
};
