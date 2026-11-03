import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { sendSuccess } from '../utils/api-response';

export class BookingController {
  static async getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slotId = req.params.id as string;
      const availability = await BookingService.getTourSlotAvailability(slotId);
      sendSuccess(res, availability, 'Tour slot availability retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slotId = req.params.id as string;
      const userId = (req.headers['x-user-id'] || req.headers['X-User-Id']) as string;
      const { seats } = req.body;

      const result = await BookingService.createBooking({
        slotId,
        userId,
        seats,
      });

      sendSuccess(res, result, 'Tour slot booked successfully', 201);
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
