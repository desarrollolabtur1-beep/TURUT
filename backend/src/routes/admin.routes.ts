import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { getUsers, getAnalyticsSummary } from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users        — Lista todos los usuarios con sus datos
// @route   GET /api/admin/analytics    — Resumen agregado para dashboard
router.get('/users', getUsers);
router.get('/analytics', getAnalyticsSummary);

export default router;
