import 'express-async-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/database.js';
import { envConfig } from './config/env.js';
import { UserRole } from './models/User.js';

// Controllers
import { authController } from './controllers/AuthController.js';
import { userController } from './controllers/UserController.js';
import { recordController } from './controllers/RecordController.js';
import { dashboardController } from './controllers/DashboardController.js';

// Middleware
import { authMiddleware } from './middlewares/authMiddleware.js';
import { requireRole, requirePermission } from './middlewares/authorizationMiddleware.js';
import { validateRequest, validateQuery } from './middlewares/validationMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Validators
import {
  registerSchema,
  loginSchema,
  createUserSchema,
  updateUserSchema,
} from './validators/authValidator.js';
import {
  createRecordSchema,
  updateRecordSchema,
  queryRecordsSchema,
  dashboardQuerySchema,
} from './validators/recordValidator.js';

const app: Express = express();

// ============ Security Middleware ============
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = envConfig.cors.origins;

    // Allow non-browser requests (curl, server-to-server, health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ Rate Limiting ============
// General API limit: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again after 15 minutes.',
  },
});

// Tight limit on auth routes: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

app.use('/auth/register', authLimiter);
app.use('/auth/login', authLimiter);
app.use(apiLimiter);

// ============ Request Logging ============
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============ Auth Routes (Public) ============
app.post(
  '/auth/register',
  validateRequest(registerSchema),
  (req, res) => authController.register(req, res)
);

app.post(
  '/auth/login',
  validateRequest(loginSchema),
  (req, res) => authController.login(req, res)
);

// ============ Protected Routes ============

// Profile
app.get(
  '/auth/profile',
  authMiddleware,
  (req, res) => authController.getProfile(req, res)
);

// ---- User Management (Admin Only) ----
app.post(
  '/users',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  validateRequest(createUserSchema),
  (req, res) => userController.createUser(req, res)
);

app.get(
  '/users',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  (req, res) => userController.listUsers(req, res)
);

app.get(
  '/users/:id',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  (req, res) => userController.getUser(req, res)
);

app.patch(
  '/users/:id',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  validateRequest(updateUserSchema),
  (req, res) => userController.updateUser(req, res)
);

app.delete(
  '/users/:id',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  (req, res) => userController.deleteUser(req, res)
);

app.get(
  '/users/:id/permissions',
  authMiddleware,
  requireRole(UserRole.ADMIN),
  (req, res) => userController.getUserPermissions(req, res)
);

app.get(
  '/roles',
  authMiddleware,
  requirePermission('manage_roles'),
  (req, res) => userController.getAvailableRoles(req, res)
);

// ---- Financial Records ----
app.post(
  '/records',
  authMiddleware,
  requirePermission('create_record'),
  validateRequest(createRecordSchema),
  (req, res) => recordController.createRecord(req, res)
);

app.get(
  '/records',
  authMiddleware,
  requirePermission('view_records'),
  validateQuery(queryRecordsSchema),
  (req, res) => recordController.listRecords(req, res)
);

app.get(
  '/records/:id',
  authMiddleware,
  requirePermission('view_records'),
  (req, res) => recordController.getRecord(req, res)
);

app.patch(
  '/records/:id',
  authMiddleware,
  requirePermission('update_record'),
  validateRequest(updateRecordSchema),
  (req, res) => recordController.updateRecord(req, res)
);

app.delete(
  '/records/:id',
  authMiddleware,
  requirePermission('delete_record'),
  (req, res) => recordController.deleteRecord(req, res)
);

// ---- Dashboard (Analyst + Admin + Viewer) ----
app.get(
  '/dashboard/summary',
  authMiddleware,
  requirePermission('view_summary'),
  validateQuery(dashboardQuerySchema),
  (req, res) => dashboardController.getSummary(req, res)
);

app.get(
  '/dashboard/category-breakdown',
  authMiddleware,
  requirePermission('view_summary'),
  validateQuery(dashboardQuerySchema),
  (req, res) => dashboardController.getCategoryBreakdown(req, res)
);

app.get(
  '/dashboard/recent-activity',
  authMiddleware,
  requirePermission('view_summary'),
  (req, res) => dashboardController.getRecentActivity(req, res)
);

app.get(
  '/dashboard/monthly-trends',
  authMiddleware,
  requirePermission('view_summary'),
  validateQuery(dashboardQuerySchema),
  (req, res) => dashboardController.getMonthlyTrends(req, res)
);

app.get(
  '/dashboard/weekly-trends',
  authMiddleware,
  requirePermission('view_summary'),
  validateQuery(dashboardQuerySchema),
  (req, res) => dashboardController.getWeeklyTrends(req, res)
);

// ---- Health Check ----
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: envConfig.appVersion,
  });
});

// ---- API Root ----
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    message: 'Finance Dashboard Backend API is running',
    docs: {
      health: '/health',
      auth: '/auth/login',
      records: '/records',
      dashboard: '/dashboard/summary',
    },
    timestamp: new Date().toISOString(),
  });
});

// ---- 404 Handler ----
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    error_code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// ---- Global Error Handler (must be last) ----
app.use(errorHandler);

// ============ Bootstrap ============
const startServer = async () => {
  let dbConnected = false;

  try {
    await AppDataSource.initialize();
    dbConnected = true;
    console.log('✓ Database connection established');
  } catch (dbError) {
    console.warn('⚠ Database connection failed:', (dbError as Error).message);
    console.warn('⚠ App will start – API calls requiring the database will fail.');
  }

  try {
    app.listen(envConfig.port, () => {
      console.log(`✓ Server running on http://localhost:${envConfig.port}`);
      console.log(`✓ Environment: ${envConfig.nodeEnv}`);
      if (!dbConnected) {
        console.log('⚠ WARNING: Database not connected. Please check your .env settings.');
      }
    });
  } catch (serverError) {
    console.error('Failed to start server:', serverError);
    process.exit(1);
  }
};

startServer();

export default app;
