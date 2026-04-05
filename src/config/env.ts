import dotenv from 'dotenv';

dotenv.config();

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

export const envConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Finance Dashboard Backend',
  appVersion: process.env.APP_VERSION || '1.0.0',
  
  // Database
  db: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'finance_dashboard',
    sslEnabled: parseBoolean(process.env.DB_SSL, process.env.NODE_ENV === 'production'),
    sslRejectUnauthorized: parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || '*')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
};
