import { generateTestToken, verifyToken } from '../utils/jwtUtil';

describe('JWT Utilities', () => {
  it('Debería generar y verificar un token JWT con roles válidos', () => {
    const payload = { id: 1, rol: 'Administrador' };
    const token = generateTestToken(payload.id, payload.rol);

    // Verificar que el token no sea nulo
    expect(token).toBeDefined();

    // Decodificar y verificar el contenido del token
    const decoded = verifyToken(token) as any;
    expect(decoded.id).toBe(payload.id);
    expect(decoded.rol).toBe(payload.rol);
  });

  it('Debería lanzar un error para un token no válido', () => {
    expect(() => verifyToken('TOKEN_INVALIDO')).toThrow();
  });
});
