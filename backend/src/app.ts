import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import logger from './utils/logger';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middlewares/errorHandler';
import { apiLimiter, authLimiter } from './middlewares/rateLimiter';
import { requestLogger } from './middlewares/requestLogger';
import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import schoolRoutes from './routes/schoolRoutes';
import adminRoutes from './routes/adminRoutes';
import testRoutes from './routes/testRoutes';
import resultRoutes from './routes/resultRoutes';
import { seedRoles } from './services/RoleService';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================== SECURITY MIDDLEWARES ====================
// Helmet - Set HTTP security headers
app.use(helmet());

// CORS - Control Cross-Origin requests
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

app.use(cors(corsOptions));

// Compression - Compress response bodies
app.use(compression());

// Cookie Parser - Parse cookies
app.use(cookieParser());

// ==================== REQUEST PARSING ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== LOGGING ====================
app.use(requestLogger);

// ==================== RATE LIMITING ====================
// Apply general rate limiter to all requests
app.use(apiLimiter);

// ==================== ROUTES ====================
// Health check endpoint (no rate limit needed)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/subscriptions', subscriptionRoutes);

// ==================== ERROR HANDLING ====================
// 404 handler - must be before error handler
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

// ==================== SERVER INITIALIZATION ====================
const startServer = async () => {
  try {
    // Connect to databases
    await connectDB();
    await connectRedis();

    // Seed default roles if needed
    try {
      await seedRoles();
    } catch (error) {
      logger.warn('Roles already seeded or error during seeding:', error);
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════╗
║   AFRI-SCHOOL SERVER STARTED          ║
╚═══════════════════════════════════════╝
📍 Server: http://localhost:${PORT}
🔧 Environment: ${NODE_ENV}
📊 Database: Connected
💾 Cache: Connected
🔐 Auth: Enabled
👥 Roles & Permissions: Enabled
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

export default app;
