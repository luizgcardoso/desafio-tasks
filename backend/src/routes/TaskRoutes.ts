// src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';

const taskRouter = Router();

const taskController = new TaskController();

// Rota principal para listar tarefas com filtros avançados
taskRouter.get('/tasks/user/:userId', taskController.listTasks);

taskRouter.post('/tasks/create/:userId', taskController.createTask);
taskRouter.get('/tasks/:id', taskController.listTaskById);
taskRouter.put('/tasks/:id', taskController.updateTask);
taskRouter.delete('/tasks/:id', taskController.deleteTask);

// Rota antiga (opcional - pode remover depois)
taskRouter.get('/tasks', taskController.listTasks); // lista todas (sem filtro de usuário)

export { taskRouter };