import { Router } from 'express';
import { PlaceController } from '../controllers/place.controller';
import { ReviewController } from '../controllers/review.controller';
import { validate } from '../middleware/validate.middleware';
import { getPlacesQuerySchema, placeIdParamSchema } from '../validations/place.validation';
import { createReviewBodySchema, actingUserHeaderSchema } from '../validations/review.validation';

const router = Router();

// GET /api/places - List and filter places with Bayesian weighted ranking
router.get(
  '/',
  validate({ query: getPlacesQuerySchema }),
  PlaceController.getPlaces
);

// GET /api/places/:id - Place details, reviews, and tour slot availability
router.get(
  '/:id',
  validate({ params: placeIdParamSchema }),
  PlaceController.getPlaceById
);

// POST /api/places/:id/reviews - Create or update review for the acting user
router.post(
  '/:id/reviews',
  validate({
    params: placeIdParamSchema,
    headers: actingUserHeaderSchema,
    body: createReviewBodySchema,
  }),
  ReviewController.submitReview
);

export default router;
