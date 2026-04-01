import { useState } from "react";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { TaskFilters } from "../components/TaskFilters";

export function Main() {
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  function reload() {
    setRefresh(!refresh);
    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-4">Minhas tarefas</h1>

        {/* FILTROS */}
        <TaskFilters setFilter={setFilter} />

        {/* BOTÃO NOVA TAREFA */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-600 transition"
        >
          {showForm ? "Cancelar" : "Nova tarefa"}
        </button>

        {/* FORM */}
        {showForm && <TaskForm onTaskCreated={reload} />}

        {/* LISTA */}
        <TaskList refresh={refresh} filter={filter} />
      </div>
    </div>
  );
}