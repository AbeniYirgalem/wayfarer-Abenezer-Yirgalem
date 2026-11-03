import { Request, Response, NextFunction } from 'express';
import { PlaceService } from '../services/place.service';
import { sendSuccess } from '../utils/api-response';
import { GetPlacesQuery } from '../validations/place.validation';

export class PlaceController {
  static async getPlaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetPlacesQuery;
      const places = await PlaceService.getPlaces({
        category: query.category,
        sort: query.sort,
        search: query.search,
      });

      sendSuccess(res, places, 'Places retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getPlaceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const place = await PlaceService.getPlaceById(id);

      sendSuccess(res, place, 'Place details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default PlaceController;
