import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { Request, Response } from 'express';

const router = Router();

// Rate limiters para prevenir ataques de fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos por ventana
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Inténtalo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // máximo 5 registros por ventana
  message: {
    success: false,
    message: 'Demasiados intentos de registro. Inténtalo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Demasiados intentos. Inténtalo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (con rate limiting)
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/reset-password', resetLimiter, resetPassword);

// Protected: get my profile
router.get('/me', protect, async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is already populated by the protect middleware
    if (!req.user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id.toString(),
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        isActive: req.user.isActive,
        profileImage: req.user.profileImage ?? '',
        bio: req.user.bio ?? '',
        visitedDestinations: req.user.visitedDestinations ?? [],
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

export default router;
