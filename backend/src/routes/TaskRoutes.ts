// src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware/AuthMiddleware';

const taskRouter = Router();
const taskController = new TaskController();

// Rota principal para listar tarefas com filtros avançados
taskRouter.get('/user/:userId', taskController.listTasks);

taskRouter.post('/create/:userId', taskController.createTask);
// taskRouter.get('/:id', taskController.listTaskById);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

// taskRouter.get('/', taskController.listTasks); // lista todas (sem filtro de usuário)

export { taskRouter };