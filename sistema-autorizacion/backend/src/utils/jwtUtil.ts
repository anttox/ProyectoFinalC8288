import jwt from 'jsonwebtoken';

// Generar un token JWT
export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

// Verificar un token JWT
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

// Generar un token JWT para pruebas
export const generateTestToken = (id: number, rol: string) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
