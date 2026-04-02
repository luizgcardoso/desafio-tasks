import { useState } from "react";
import api from "../services/api";

export function TaskForm({ onTaskCreated }: { onTaskCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = 4;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description || !startDate) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/tasks/create/${userId}`, {
        title,
        description,
        startDate,
      });

      setTitle("");
      setDescription("");
      setStartDate("");
      onTaskCreated();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mb-4"
    >
      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Nome da tarefa"
        value={title}
        type="text"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Descrição da tarefa"
        value={description}
        type="text"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={startDate}
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`text-white px-4 py-2 rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}