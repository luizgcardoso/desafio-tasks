import { Request, Response } from "express";
import { Between, Like } from "typeorm";
import { taskRepository } from "../repositories/TaskRepository";

export class TaskController {

  async listTasks(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID de usuário inválido"
        });
      }

      const { status, period, startDate, endDate, search } = req.query;

      const where: any = {
        user: { id: userId }
      };

      if (status && typeof status === 'string') {
        where.status = status;
      }

      if (search && typeof search === 'string' && search.trim() !== '') {
        where.title = Like(`%${search.trim()}%`);
      }

      if (period === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        where.created_at = Between(today, tomorrow);
      }
      else if (period === 'last-week') {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);

        where.created_at = Between(lastWeek, today);
      }
      else if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Formato de data inválido. Use YYYY-MM-DD"
          });
        }
        where.created_at = Between(start, end);
      }

      const tasks = await taskRepository.find({
        where,
        relations: { user: true },
        order: { created_at: "DESC" }
      });

      return res.json({
        success: true,
        count: tasks.length,
        tasks
      });

    } catch (error: any) {
      console.error("Erro ao listar tarefas:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno ao listar tarefas",
        error: error.message || "Erro desconhecido"
      });
    }
  }

  async createTask(req: Request, res: Response) {
    const { title, description } = req.body;
    const { userId } = req.params;

    if (!title || typeof title !== 'string' || title.trim() === '' || !description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "O título e a descrição da tarefa são obrigatórios e devem ser strings não vazias"
      });
    }
    try {
      const task = taskRepository.create({
        title,
        description,
        user: { id: Number(userId) }

      });
      await taskRepository.save(task);
      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to create task" });
    }
  }

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
      const task = await taskRepository.findOneBy({ id: Number(id) });
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (title !== undefined) task.title = title;

      if (description !== undefined) task.description = description;

      if (status && status !== task.status) {
        task.status = status;

        if (status === 'em-andamento' && !task.started_at) {
          task.started_at = new Date();
        }

        if (status === 'concluido' && !task.finished_at) {
          task.finished_at = new Date();
        }

        if (status === 'pendente') {
          task.started_at = null;
          task.finished_at = null;
        }
      }

      await taskRepository.save(task);

      return res.json({
        success: true,
        message: "Task updated successfully",
        task
      });

    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update task"
      });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await taskRepository.findOneBy({ id: Number(id) });
      if (!task) return res.status(404).json({ message: "Task not found" });

      await taskRepository.softDelete(id);
      return res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to delete task" });
    }
  }
}