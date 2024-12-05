export const authMiddleware = jest.fn((req: any, res: any, next: any) => {
  req.user = { id: 1, rol: 'Administrador' }; // Usuario simulado
  next();
});

export default authMiddleware;
