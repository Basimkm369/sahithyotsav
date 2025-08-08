/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ?? 5000;
export const ENV: 'development' | 'production' = (process.env.ENV as any) ?? 'development';
export const CORS_ENABLED_URLS = process.env.CORS_ENABLED_URLS;

// Database
export const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;


// Local Database
export const { LOCAL_DB_NAME,LOCAL_DB_PORT, LOCAL_DB_USER, LOCAL_DB_PASSWORD, LOCAL_DB_HOST } = process.env;

// Rate Limit
export const MAX_REQUEST_LIMIT = +process.env.MAX_REQUEST_LIMIT! || 10000;
export const MAX_REQUEST_WINDOW = +process.env.MAX_REQUEST_WINDOW! || 15 * 60;

// Logging
export const { TG_BOT_API_KEY } = process.env;
export const { TG_CHANNEL_ID } = process.env;
export const WARN_RESPONSE_TIME = process.env.WARN_RESPONSE_TIME
  ? +process.env.WARN_RESPONSE_TIME
  : null; // Milliseconds

export const verifyEnvVars = () => {
  const missingVars = [];
  if (!PORT) missingVars.push('PORT');
  if (!ENV) missingVars.push('ENV');
  if (!CORS_ENABLED_URLS) missingVars.push('CORS_ENABLED_URLS');
  if (!MAX_REQUEST_LIMIT) missingVars.push('MAX_REQUEST_LIMIT');
  if (!MAX_REQUEST_WINDOW) missingVars.push('MAX_REQUEST_WINDOW');
  if (!DB_NAME) missingVars.push('DB_NAME');
  if (!DB_USER) missingVars.push('DB_USER');
  if (!DB_PASSWORD) missingVars.push('DB_PASSWORD');
  if (!DB_HOST) missingVars.push('DB_HOST');
  if (!LOCAL_DB_NAME) missingVars.push('LOCAL_DB_NAME');
  if (!LOCAL_DB_USER) missingVars.push('LOCAL_DB_USER');
  if (!LOCAL_DB_PASSWORD) missingVars.push('LOCAL_DB_PASSWORD');
  if (!LOCAL_DB_HOST) missingVars.push('LOCAL_DB_HOST');
  if (!LOCAL_DB_PORT) missingVars.push('LOCAL_DB_PORT');

  if (missingVars.length) {
    console.log(
      `ENV variable${missingVars.length > 1 ? 's' : ''} ${missingVars.join(', ')} ${
        missingVars.length > 1 ? 'are' : 'is'
      } missing`,
    );
    return false;
  }

  if (!['development', 'production'].includes(ENV)) {
    console.log(`Invalid ENV value: ${ENV}`);
    return false;
  }

  return true;
};
