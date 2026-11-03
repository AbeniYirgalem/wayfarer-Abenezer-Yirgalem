import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { sendSuccess } from '../utils/api-response';

export class ReviewController {
  static async submitReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const placeId = req.params.id as string;
      const userId = (req.headers['x-user-id'] || req.headers['X-User-Id']) as string;
      const { rating, body } = req.body;

      const result = await ReviewService.submitReview({
        placeId,
        userId,
        rating,
        body,
      });

      const message = result.isNew
        ? 'Review created successfully'
        : 'Review updated successfully';

      const statusCode = result.isNew ? 201 : 200;

      sendSuccess(res, result, message, statusCode);
    } catch (error) {
      next(error);
    }
  }
}

export default ReviewController;
