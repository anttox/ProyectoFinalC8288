// src/__mocks__/jwtUtil.ts
export const generateToken = jest.fn(() => 'TOKEN_MOCK');

export const verifyToken = jest.fn((token: string) => {
  if (token === 'TOKEN_VALIDO') {
    return { id: 1, rol: 'Administrador' };  // Si el token es válido, devuelve el objeto esperado
  }
  throw new Error('Token inválido');  // Lanza error si el token no es válido
});

export const generateTestToken = jest.fn(() => 'TOKEN_DE_PRUEBA');
