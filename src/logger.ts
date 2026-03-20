import { createLogger, format, transports } from 'winston';

export const appLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    }),
  ),
  transports: [
    new transports.Console(),
    // Puedes agregar más transports, como archivos, si lo deseas
  ],
});
