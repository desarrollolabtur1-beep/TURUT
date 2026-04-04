import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

/**
 * Centralized error handler.
 * Translates Mongoose-specific errors into human-readable API responses.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode ?? (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message ?? 'Error del servidor';

  // Mongoose: Invalid ObjectId
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `ID inválido: ${err.value}`;
  }

  // Mongoose: Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e: any) => e.message);
    message = messages.join('. ');
  }

  // MongoDB: Duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'campo';
    message = `El ${field} ya está registrado`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * 404 handler — must be registered BEFORE errorHandler.
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: any = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
