import { Request, Response } from "express"
import { taskRepository } from "../repositories/TaskRepository";
import { userRepository } from "../repositories/UserRepository";
import { Between } from "typeorm";
import { count } from "console";

export class TaskController {

  async createTask(req: Request, res: Response) {
    const { title, description } = req.body;
    const { userId } = req.params;
    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user || null) {
        return res.status(404).json({ message: "User not found" });
      }
      const task = await taskRepository.create({ title, description, user });
      await taskRepository.save(task);
      return res.status(201).json(task); // created 
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to create task" });
    }
  }

  async listTasks(req: Request, res: Response) {
    try {
      const tasks = await taskRepository.find({ relations: { user: true } });
      if (!tasks) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(tasks);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }

  async listTaskById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await taskRepository.findOneBy({ id: Number(id) });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(task);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }

  async listTasksByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const tasks = await taskRepository.find({
        /* 
        refatorar/testar
        where:{user}
        */
        where: {
          user: { id: Number(userId) }
        },
        relations: { user: true }
      });
      return res.json({ count: tasks.length, tasks });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }

  async listTasksByDateInterval(req: Request, res: Response) {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    // const { userId, startDate, endDate } = req.query;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ mmesage: "Required parameters missing" })
      // message: "Os parâmetros startDate e endDate são obrigatórios (formato YYYY-MM-DD)"
    }
    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tasks = await taskRepository.find({
        where: {
          user: { id: Number(userId) },
          created_at: Between(
            new Date(`${startDate}T00:00:00`),
            new Date(`${endDate}T23:59:59`)
          ),
        },
        relations: { user: true },
        order: { created_at: "ASC" }
      });
      if (tasks.length === 0) {
        return res.status(200).json({ message: "Tasks not found" });
      }
      return res.json({ count: tasks.length, tasks });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }

  async listTasksToday(req: Request, res: Response) {
    const { userId } = req.params;
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tasks = await taskRepository.find({
        where: {
          user: { id: Number(userId) },
          created_at: Between(start, end),
        },
        relations: { user: true },
        order: { created_at: "ASC" }
      });
      if (tasks.length === 0) {
        return res.status(200).json({ message: "Tasks not found" });
      }
      return res.json({ count: tasks.length, tasks });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }
  async listTasksLastWeek(req: Request, res: Response) {
    const { userId } = req.params;

    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date();

    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tasks = await taskRepository.find({
        where: {
          user: { id: Number(userId) },
          created_at: Between(start, end),
        },
        relations: { user: true },
        order: { created_at: "ASC" }
      });
      if (tasks.length === 0) {
        return res.status(200).json({ message: "Tasks not found" });
      }
      return res.json({ count: tasks.length, tasks });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }

  async listTasksPending(req: Request, res: Response) {
    const { userId } = req.params;

    try {
      const user = await userRepository.findOneBy({ id: Number(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tasks = await taskRepository.find({
        where: {
          user: { id: Number(userId) },
          status: "pendente",
        },
        relations: { user: true },
        order: { created_at: "ASC" }
      });
      if (tasks.length === 0) {
        return res.status(200).json({ message: "Tasks not found" });
      }
      return res.json({ count: tasks.length, tasks });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to list tasks" });
    }
  }


  async updateTask(req: Request, res: Response) {
    const { title, description, status } = req.body;
    const { id } = req.params;
    try {
      const task = await taskRepository.findOneBy({ id: Number(id) });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      task.title = String(title);
      task.description = String(description);
      task.status = String(status);
      await taskRepository.save(task);
      return res.status(200).json({ message: "Task updated successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to update task" });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await taskRepository.findOneBy({ id: Number(id) });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      await taskRepository.update(id, { deleted_at: new Date() });
      await taskRepository.softDelete(id);
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  }

}