import Router from 'express';

import { TaskController } from '../controllers/TaskController';

const taskRouter = Router();

taskRouter.post('/tasks/:userId', new TaskController().createTask);

taskRouter.get('/tasks', new TaskController().listTasks);
taskRouter.get('/tasks/:id', new TaskController().listTaskById);
taskRouter.get('/tasks/user/:userId', new TaskController().listTasksByUserId);
// lista tarefas por intervalo de datas
taskRouter.get('/tasks/:userId/date-range', new TaskController().listTasksByDateInterval);
// lista tarefas criadas hoje
taskRouter.get('/tasks/:userId/today', new TaskController().listTasksToday);
// lista tarefas criadas na última semana
taskRouter.get('/tasks/:userId/last-week', new TaskController().listTasksLastWeek);
// lista tarefas pendentes
taskRouter.get('/tasks/:userId/pending', new TaskController().listTasksPending);

taskRouter.put('/tasks/:id', new TaskController().updateTask);
taskRouter.delete('/tasks/:id', new TaskController().deleteTask);


export { taskRouter };