import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get('/users', userController.getAllUsers);

router.get('/users/me', verifyToken, userController.getMe.bind(userController)); 

router.patch('/users/me', verifyToken, userController.editMe.bind(userController)); 

router.get('/users/:id', verifyToken, userController.getUserById.bind(userController));

export default router;