import './types/index';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import experienceRoutes from './routes/experience.routes';
import bookingRoutes from './routes/booking.routes';
import profileRoutes from './routes/profile.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import mongoose from 'mongoose';

const app = express();

// ─── Connect Database ─────────────────────────────
connectDB();

// ─── Global Middleware ────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// ─── Health Check ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    status: 'ok',
    environment: env.NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error Handling ───────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 TURUT Backend                    ║
  ║   Mode: ${env.NODE_ENV.padEnd(28)}║
  ║   Port: ${String(env.PORT).padEnd(28)}║
  ║   Health: http://localhost:${env.PORT}/api/health ║
  ╚═══════════════════════════════════════╝
  `);
});
