import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import api from './api';
import responseHandler from './middlewares/responseHandler';
import AppError from './models/AppError';
import logger from './utils/logger';
import { CORS_ENABLED_URLS, PORT, verifyEnvVars, WARN_RESPONSE_TIME } from './config/env';
import rateLimiter from './middlewares/rateLimiter';
import { connectToDatabase } from './utils/db';

dotenv.config();
verifyEnvVars();

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// CORS
const whitelist = (CORS_ENABLED_URLS ?? '').split(',');
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // bypass the requests with no origin (like curl requests, mobile apps, etc)
    if (origin && whitelist.indexOf(origin) === -1) {
      logger.error(`CORS: This site ${origin} does not have an access.`);
      const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    if (!origin) {
      // logger.warn('CORS: Client without origin has accessed the site.');
    }
    return callback(null, true);
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Log HTTP requests
app.use(
  morgan(
    (tokens, req, res) =>
      JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        remoteAddr: tokens['remote-addr'](req, res),
        remoteUser: tokens['remote-user'](req, res),
        userAgent: tokens['user-agent'](req, res),
        referrer: tokens.referrer(req, res),
        status: Number.parseFloat(tokens.status(req, res) || ''),
        responseTime: Number.parseFloat(tokens['response-time'](req, res) || ''),
      }),
    {
      stream: {
        write: (str) => {
          const { method, url, remoteAddr, remoteUser, userAgent, referrer, status, responseTime } =
            JSON.parse(str);
          const message = `${method} -- ${url} ${status} ${remoteAddr} - ${remoteUser} "${referrer}" "${userAgent}" ${responseTime}ms`;
          logger.http(message.trim());
          if (WARN_RESPONSE_TIME && responseTime >= WARN_RESPONSE_TIME) {
            logger.warn(
              `An API took ${parseInt(responseTime, 10)}ms to respond \n\n${method} ${url}`,
            );
          }
        },
      },
    },
  ),
);

app.use('/api', api);

// Catch 404 Routes
app.use((_, __, next) => {
  return next(new AppError('Invalid API route', 404));
});

// Handle api response and errors
app.use(responseHandler);

connectToDatabase();

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}`);
});
