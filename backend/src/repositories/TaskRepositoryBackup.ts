import { AppDataSource } from "../database/data-source";
import { Task } from "../entities/Task";
export const taskRepository = AppDataSource.getRepository(Task).extend({

  async findWithFilters(filters: any): Promise<Task[]> {
    const query = taskRepository.createQueryBuilder('task')
      .where('task.userId = :userId', { userId: filters.userId });

    // Filtro por status
    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    // Filtro por busca (title ou description)
    if (filters.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    // Filtro por período (today, last-week, last-month)
    if (filters.period) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filters.period === 'today') {
        query.andWhere('task.created_at >= :start', { start: today });
        query.andWhere('task.created_at < :end', {
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        });
      }
      else if (filters.period === 'last-week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        query.andWhere('task.created_at >= :start', { start: lastWeek });
      }
      else if (filters.period === 'last-month') {
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query.andWhere('task.created_at >= :start', { start: lastMonth });
      }
    }
    // Filtro manual por intervalo de datas
    else if (filters.startDate && filters.endDate) {
      query.andWhere('task.created_at >= :startDate', { startDate: filters.startDate });
      query.andWhere('task.created_at <= :endDate', { endDate: filters.endDate });
    }

    query.orderBy('task.created_at', 'DESC');

    return query.getMany();
  }
});

export default taskRepository;