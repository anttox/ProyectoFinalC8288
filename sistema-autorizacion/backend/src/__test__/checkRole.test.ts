/*
import request from 'supertest';
import app from '../server';
import logger from '../utils/logger';

// Mock del logger
jest.mock('../utils/logger', () => require('../__mocks__/logger'));

describe('Middleware checkRole', () => {
  beforeAll(() => {
    // Cambiar la implementación de spyOn para ajustarse al tipo esperado de Winston
    jest.spyOn(logger, 'info').mockImplementation((infoObject: { message: string, level: string }) => {}); 
    jest.spyOn(logger, 'warn').mockImplementation((infoObject: { message: string, level: string }) => {}); 
    jest.spyOn(logger, 'error').mockImplementation((infoObject: { message: string, level: string }) => {}); 
    jest.spyOn(logger, 'debug').mockImplementation((infoObject: { message: string, level: string }) => {}); 
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Debería denegar acceso si el rol no es permitido', async () => {
    const response = await request(app)
      .get('/api/users/admin/users')
      .set('Authorization', 'Bearer TOKEN_DE_OPERADOR'); // Simula un token no permitido

    expect(response.status).toBe(403);
    expect(response.body.mensaje).toContain('Acceso denegado');
  });

  it('Debería permitir acceso si el rol es permitido', async () => {
    const response = await request(app)
      .get('/api/users/admin/users')
      .set('Authorization', 'Bearer TOKEN_DE_ADMINISTRADOR'); // Simula un token permitido

    expect(response.status).toBe(200);
  });
});
*/