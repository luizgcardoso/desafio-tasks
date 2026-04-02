import Router from 'express';

import { UserController } from '../controllers/UserController';

const userRouter = Router();


userRouter.post('/users', new UserController().createUser);

userRouter.get('/users', new UserController().listUsers);
userRouter.get('/users/:id', new UserController().listUserById);

userRouter.put('/users/:id', new UserController().updateUser);
userRouter.delete('/users/:id', new UserController().deleteUser);

export { userRouter };