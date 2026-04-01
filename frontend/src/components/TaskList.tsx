import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
}

export function TaskList({ refresh, filter }: { refresh: boolean; filter: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Memoizando a função para evitar recriações desnecessárias
  const fetchTasks = useCallback(async () => {
    let url = "/tasks";

    if (filter === "today") url = "/tasks/today";
    if (filter === "week") url = "/tasks/week";

    try {
      const response = await api.get<Task[]>(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }, [filter]);

  // Busca inicial + quando refresh ou filter mudar
  useEffect(() => {
    fetchTasks();
  }, [refresh, filter, fetchTasks]);

  async function deleteTask(id: number) {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks(); // atualiza a lista após excluir
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{task.title}</p>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>

          <div className="flex gap-2">
            <button className="text-blue-500">Editar</button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500"
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}