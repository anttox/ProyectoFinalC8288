import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // Cambiar a number si es necesario
        rol: string;
      };
    }
  }
}
