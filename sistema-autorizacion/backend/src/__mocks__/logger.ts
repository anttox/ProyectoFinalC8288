// src/__mocks__/logger.ts
import { Logger, LeveledLogMethod } from 'winston';

// Mocking los métodos de Winston
const logger: Partial<Logger> = {
  info: jest.fn() as LeveledLogMethod,
  warn: jest.fn() as LeveledLogMethod,
  error: jest.fn() as LeveledLogMethod,
  debug: jest.fn() as LeveledLogMethod,
  log: jest.fn() as LeveledLogMethod,
};

export default logger;
