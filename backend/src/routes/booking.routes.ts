import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getMyBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/', getMyBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;