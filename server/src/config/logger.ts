import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors, json, splat } = format;

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        printf(({ timestamp: ts, level, message, stack, ...meta }) => {
          const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return stack ? `${ts} [${level}]: ${message}\n${stack}` : `${ts} [${level}]: ${message}${metaString}`;
        })
      )
    })
  ]
});

export default logger;
