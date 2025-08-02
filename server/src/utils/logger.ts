import winston from 'winston';
import 'winston-daily-rotate-file';
import TelegramTransport from 'src/utils/telegramTransport';
import { ENV } from 'src/config/env';

const { combine, timestamp, printf } = winston.format;

const format = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level.toUpperCase()}] ${typeof message === 'object' ? JSON.stringify(message) : message}`;
});

const commonProps = {
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
  utc: true,
  createSymlink: true,
  format: combine(
    timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }),
    format,
    winston.format.colorize(),
  ),
};

const warnLog = new winston.transports.DailyRotateFile({
  ...commonProps,
  filename: '%DATE%.log',
  dirname: './logs/error',
  level: 'warn',
  format: combine(timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }), winston.format.prettyPrint()),
});

const errorLog = new winston.transports.DailyRotateFile({
  ...commonProps,
  filename: '%DATE%.log',
  dirname: './logs/error',
  level: 'error',
  format: combine(timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }), winston.format.prettyPrint()),
});

const accessLog = new winston.transports.DailyRotateFile({
  ...commonProps,
  filename: '%DATE%.log',
  dirname: './logs/access',
  level: 'http',
});

const telegram = new TelegramTransport();

const logger = winston.createLogger({
  transports: [errorLog, warnLog, accessLog, telegram],
});

if (ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      level: 'silly',
      format: combine(
        timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }),
        format,
        winston.format.colorize(),
      ),
    }),
  );
} else if (ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'info',
      format: combine(
        timestamp({ format: 'MM/DD/YYYY hh:mm:ss.SSS' }),
        format,
        winston.format.colorize(),
      ),
    }),
  );
}

export default logger;
