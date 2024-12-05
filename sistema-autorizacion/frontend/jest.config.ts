/* eslint-disable import/no-anonymous-default-export */

export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Transforma archivos TypeScript y JSX
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock para estilos
      '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js', // Mock para archivos estáticos
      '^axios$': '<rootDir>/node_modules/axios/dist/axios.min.js', // Mapeo para axios
      '^react-router-dom$': '<rootDir>/node_modules/react-router-dom', // Mapeo para react-router-dom
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios|react-router-dom)', // Procesa estas dependencias también
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensiones válidas
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // Configuración adicional
};
  