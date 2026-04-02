import { useState } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Main() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { user, logout } = useAuth();

  const reload = () => {
    setRefresh(!refresh);
    setShowForm(false); // fecha o form após cadastrar
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Olá, {user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Botão para expandir formulário */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all"
        >
          <Plus size={28} />
          {showForm ? 'Fechar Formulário' : 'Nova Tarefa'}
        </button>

        {/* Formulário expansível */}
        {showForm && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow transition-all">
            <TaskForm onTaskCreated={reload} />
          </div>
        )}

        {/* Lista de Tarefas */}
        <TaskList refresh={refresh} filter={""} />
      </div>
    </div>
  );
}