// src/routes/UserRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import authMiddleware from '../middleware/AuthMiddleware';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

// TESTAR
userRouter.use(authMiddleware);

userRouter.get('/', userController.listUsers);
userRouter.get('/:id', userController.listUserById);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export { userRouter };