import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getExperiences,
  getExperienceById,
  getFeaturedExperiences,
  getMyExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experience.controller';
import { markDestinationVisited } from '../controllers/profile.controller';

const router = Router();

// ─── Public routes ────────────────────────────────
router.get('/', getExperiences);
router.get('/featured', getFeaturedExperiences);  // Must be BEFORE /:id

// ─── Private routes (require authentication) ─────
router.use(protect);

router.get('/my-experiences', getMyExperiences);   // Must be BEFORE /:id
router.post('/', createExperience);
router.post('/:id/visit', markDestinationVisited); // Mark destination as visited
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

// /:id must be LAST — it matches any string as an ID
router.get('/:id', getExperienceById);

export default router;