import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { getUploadSignature } from '../controllers/uploads.controller';

const router = Router();

// Toda ruta de uploads requiere autenticación
router.use(protect);

// @route   POST /api/uploads/signature
router.post('/signature', getUploadSignature);

export default router;
