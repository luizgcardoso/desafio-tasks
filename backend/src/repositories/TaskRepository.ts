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
      if (filters.period === 'today') {
        query.andWhere("DATE(task.created_at) = CURRENT_DATE");
      }
      else if (filters.period === 'last-week') {
        query.andWhere("task.created_at >= CURRENT_DATE - INTERVAL '7 days'");
      }
      else if (filters.period === 'last-month') {
        query.andWhere("task.created_at >= CURRENT_DATE - INTERVAL '1 month'");
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

  async findByUser(userId: number): Promise<Task[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { created_at: 'DESC' }
    });
  }
});

export default taskRepository;