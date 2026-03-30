import Router from 'express';

import { TaskController } from '../controllers/TaskController';

const taskRouter = Router();

taskRouter.post('/tasks/create/:userId', new TaskController().createTask);

taskRouter.get('/tasks', new TaskController().listTasks);
taskRouter.get('/tasks/:id', new TaskController().listTaskById);
taskRouter.get('/tasks/user/:userId', new TaskController().listTasksByUserId);
// lista tarefas por intervalo de datas
taskRouter.get('/tasks/date-range', new TaskController().listTasksByDateInterval);

taskRouter.put('/tasks/:id', new TaskController().updateTask);

taskRouter.delete('/tasks/:id', new TaskController().deleteTask);


export { taskRouter };