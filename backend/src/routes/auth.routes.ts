import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { User } from '../models/User.model';
import { Request, Response } from 'express';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

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
