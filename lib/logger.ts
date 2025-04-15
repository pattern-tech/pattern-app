import { Logger } from 'next-axiom';

const baseLogger = new Logger({
  source: 'pattern-app',
});

// Helper functions for different log levels
export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    baseLogger.info(message, metadata);
  },
  error: (
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
  ) => {
    baseLogger.error(message, { error, ...metadata });
  },
  warn: (message: string, metadata?: Record<string, unknown>) => {
    baseLogger.warn(message, metadata);
  },
  debug: (message: string, metadata?: Record<string, unknown>) => {
    baseLogger.debug(message, metadata);
  },
};
