console.log('Resolviendo src/models/logModel en:', require.resolve('src/models/logModel'));
jest.mock('src/models/logModel', () => require('src/__mocks__/dbMock'));  // Para mockear el logModel con dbMock

console.log('Resolviendo src/models/resourceModel en:', require.resolve('src/models/resourceModel'));
jest.mock('src/models/resourceModel', () => require('src/__mocks__/dbMock'));  // Para mockear el resourceModel con dbMock

console.log('Resolviendo src/models/userModel en:', require.resolve('src/models/userModel'));
jest.mock('src/models/userModel', () => require('src/__mocks__/dbMock'));  // Para mockear el userModel con dbMock

// Asegúrate de que otros mocks estén también configurados correctamente
jest.mock('src/utils/logger', () => require('src/__mocks__/logger'));
jest.mock('src/utils/jwtUtil', () => require('src/__mocks__/jwtUtil'));
jest.mock('src/middlewares/authMiddleware', () => require('src/__mocks__/authMiddleware'));
