import { Router } from 'express';
import healthRoute from './health.route';
import placeRoutes from './place.routes';
import userRoutes from './user.routes';
import bookingRoutes from './booking.routes';

const router = Router();

// Health check endpoint
router.use('/health', healthRoute);

// Places and reviews endpoints
router.use('/places', placeRoutes);

// Users endpoint for acting-as switcher
router.use('/users', userRoutes);

// Tour slot bookings and availability endpoints
router.use('/tours', bookingRoutes);

export default router;
