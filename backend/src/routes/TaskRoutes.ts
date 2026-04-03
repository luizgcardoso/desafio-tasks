import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import authMiddleware from '../middleware/AuthMiddleware';

const taskRouter = Router();
const taskController = new TaskController();

taskRouter.use(authMiddleware);

taskRouter.post('/create/:userId', taskController.createTask);
taskRouter.get('/user/:userId', taskController.listTasks);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export { taskRouter };