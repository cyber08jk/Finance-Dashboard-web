import { DataSource } from 'typeorm';
import { envConfig } from './env.js';
import { User } from '../models/User.js';
import { FinancialRecord } from '../models/FinancialRecord.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: envConfig.db.url,
  host: envConfig.db.url ? undefined : envConfig.db.host || '/var/run/postgresql',
  port: envConfig.db.url ? undefined : (envConfig.db.port && envConfig.db.host ? envConfig.db.port : undefined),
  username: envConfig.db.url ? undefined : envConfig.db.username,
  password: envConfig.db.url ? undefined : envConfig.db.password || '',
  database: envConfig.db.url ? undefined : envConfig.db.name,
  synchronize: envConfig.nodeEnv === 'development', // Only in dev
  logging: false, // Disable to prevent pg concurrency warnings
  entities: [User, FinancialRecord],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  ssl: envConfig.db.sslEnabled
    ? { rejectUnauthorized: envConfig.db.sslRejectUnauthorized }
    : false,
  // Connection pooling
  poolSize: 5,
  maxQueryExecutionTime: 1000, // Log slow queries only
  cache: {
    type: 'database',
    duration: 60000, // 60 seconds
  },
});
