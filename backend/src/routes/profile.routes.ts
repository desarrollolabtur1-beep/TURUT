import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

// All profile routes require authentication
router.use(protect);

// @route   GET  /api/user/profile
// @route   PUT  /api/user/profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
