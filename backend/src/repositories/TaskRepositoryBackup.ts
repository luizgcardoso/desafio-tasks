// src/repositories/TaskRepository.ts
import { AppDataSource } from "../database/data-source";
import { Task } from "../entities/Task";

export const taskRepository = AppDataSource.getRepository(Task).extend({

  async findWithFilters(filters: any): Promise<Task[]> {
    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.user', 'user')
      .where('task.user_id = :userId', { userId: filters.userId })
      .orderBy('task.created_at', 'DESC');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = `%${filters.search.trim()}%`;
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: searchTerm }
      );
    }

    if (filters.period) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filters.period === 'today') {
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        query.andWhere('task.created_at >= :start', { start: today });
        query.andWhere('task.created_at < :end', { end: tomorrow });
      } else if (filters.period === 'last-week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        query.andWhere('task.created_at >= :start', { start: lastWeek });
      } else if (filters.period === 'last-month') {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query.andWhere('task.created_at >= :start', { start: lastMonth });
      }
    }
    else if (filters.startDate && filters.endDate) {
      query.andWhere('task.created_at >= :startDate', {
        startDate: new Date(filters.startDate)
      });
      query.andWhere('task.created_at <= :endDate', {
        endDate: new Date(filters.endDate + 'T23:59:59')
      });
    }

    return query.getMany();
  },

  // Método de compatibilidade
  async findByUser(userId: number): Promise<Task[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { created_at: 'DESC' }
    });
  }
});

export default taskRepository;