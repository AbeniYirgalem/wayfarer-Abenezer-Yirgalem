import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

// GET /api/users - List users for acting-as switcher
router.get('/', UserController.getUsers);

export default router;
