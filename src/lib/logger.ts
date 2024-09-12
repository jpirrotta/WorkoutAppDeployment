import pino, { Logger } from 'pino';

// Use `info` as our standard log level if not specified
const logLevel = process.env.LOG_LEVEL ?? 'info';

export const logger: Logger =
  process.env.NODE_ENV === 'production'
    ? // JSON in production
      pino({ level: logLevel })
    : // Pretty print in development
      pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
        level: logLevel,
      });

export default logger;
