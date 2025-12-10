import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUserRegistration } from '../middlewares/valid.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();
const userController = new UserController();

router.post('/auth/register', rateLimit({ windowMs: 600000, max: 5 }), validateUserRegistration, userController.registerNewUser);

router.post('/auth/login', rateLimit({ windowMs: 600000, max: 5 }), userController.loginUser);

export default router;