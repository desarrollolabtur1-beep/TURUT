import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getProfile, updateProfile, makeMeAdmin } from '../controllers/profile.controller';

const router = Router();

// Endpoint temporal público para que puedas volverte admin
router.get('/make-me-admin', makeMeAdmin);

// All profile routes require authentication
router.use(protect);

// @route   GET  /api/user/profile
// @route   PUT  /api/user/profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
