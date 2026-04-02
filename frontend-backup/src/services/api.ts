import type Task from "../types/Task";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function taskApi() {
  return {
    getAll: async (): Promise<Task[]> => {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Erro ao buscar tarefas');
      return res.json();
    },

    create: async (title: string): Promise<Task> => {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Erro ao criar tarefa');
      return res.json();
    },

    toggle: async (id: string): Promise<Task> => {
      const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: 'PATCH',
      });
      return res.json();
    },

    delete: async (id: string): Promise<void> => {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    },
  };
}