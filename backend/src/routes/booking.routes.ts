import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { validate } from '../middleware/validate.middleware';
import { tourSlotIdParamSchema, createBookingBodySchema } from '../validations/booking.validation';
import { actingUserHeaderSchema } from '../validations/review.validation';

const router = Router();

// GET /api/tours/:id/bookings - Tour slot availability calculation
router.get(
  '/:id/bookings',
  validate({ params: tourSlotIdParamSchema }),
  BookingController.getAvailability
);

// POST /api/tours/:id/bookings - Book tour slot with concurrency safety
router.post(
  '/:id/bookings',
  validate({
    params: tourSlotIdParamSchema,
    headers: actingUserHeaderSchema,
    body: createBookingBodySchema,
  }),
  BookingController.createBooking
);

export default router;
