import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { env } from '../config/env';

/**
 * Protects routes by verifying JWT and attaching the user to the request.
 * After this middleware: req.user = full user doc, req.userId = user ID string.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401).json({
        success: false,
        message: 'No autorizado — token no proporcionado',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No autorizado — token malformado',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    // Fetch user from DB (without password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado — usuario no encontrado',
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'No autorizado — cuenta desactivada',
      });
      return;
    }

    // Attach user to request — both formats for backward compatibility
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'No autorizado — token inválido',
    });
  }
};

/**
 * Role-based access control. Use after `protect` middleware.
 * Example: authorize('admin')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Rol '${req.user.role}' no tiene permiso para esta acción`,
      });
      return;
    }

    next();
  };
};
