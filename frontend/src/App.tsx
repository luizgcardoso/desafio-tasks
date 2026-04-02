import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  status: string;
}

const API_BASE = 'http://localhost:3000';
const USER_ID = 6; // ⚠️ Altere para o ID do seu usuário

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isNewFormExpanded, setIsNewFormExpanded] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Carregar tarefas
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/user/${USER_ID}`);
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o backend');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ====================== ADICIONAR TAREFA ======================
  const handleAddTask = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || '',
        }),
      });

      if (!res.ok) throw new Error();

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setNewTitle('');
      setNewDescription('');
      setIsNewFormExpanded(false);
    } catch (err) {
      alert('Erro ao adicionar tarefa');
    }
  };

  // ====================== ATUALIZAR STATUS (com data automática) ======================
  const toggleStatus = async (task: Task) => {
    const statusOrder: Record<string, string> = {
      pendente: 'em-andamento',
      'em-andamento': 'concluido',
      concluido: 'pendente',
    };

    const newStatus = statusOrder[task.status] || 'pendente';
    let finished_at: string | null = task.finished_at;

    if (newStatus === 'concluido') {
      finished_at = new Date().toISOString();
    } else {
      finished_at = null;
    }

    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
          finished_at,           // ← Enviando a data
        }),
      });

      setTasks(tasks.map(t =>
        t.id === task.id ? { ...t, status: newStatus, finished_at } : t
      ));
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  // ====================== SALVAR EDIÇÃO ======================
  const saveEdit = async (id: number) => {
    const isCompleting = editStatus === 'concluido';
    const finished_at = isCompleting ? new Date().toISOString() : null;

    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
          finished_at,
        }),
      });

      setTasks(tasks.map(t =>
        t.id === id
          ? { ...t, title: editTitle, description: editDescription, status: editStatus, finished_at }
          : t
      ));
      setEditingId(null);
    } catch (err) {
      alert('Erro ao salvar edição');
    }
  };

  // ====================== OUTRAS FUNÇÕES ======================
  const deleteTask = async (id: number) => {
    if (!confirm('Excluir esta tarefa?')) return;
    try {
      await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
      setExpandedTasks(prev => { const s = new Set(prev); s.delete(id); return s; });
    } catch (err) {
      alert('Erro ao deletar');
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
  };

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedTasks);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedTasks(newSet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">To-Do List</h1>
        <h3 className="text-center text-lg font-semibold text-gray-600 mb-8">ADICIONAR NOVA TAREFA</h3>

        {/* Formulário Nova Tarefa */}
        <div className="mb-10 border border-gray-200 rounded-3xl overflow-hidden">
          <div
            className="flex items-center p-5 cursor-pointer hover:bg-gray-50"
            onClick={() => setIsNewFormExpanded(true)}
          >
            <input
              type="text"
              placeholder="Título da nova tarefa..."
              className="flex-1 bg-transparent focus:outline-none text-lg placeholder-gray-400"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onFocus={() => setIsNewFormExpanded(true)}
            />
          </div>

          {isNewFormExpanded && (
            <div className="px-5 pb-5 space-y-4">
              <textarea
                placeholder="Descrição detalhada..."
                className="w-full h-28 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
              />
              <div className="flex gap-3">
                <button onClick={handleAddTask} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl">
                  Adicionar Tarefa
                </button>
                <button
                  onClick={() => { setIsNewFormExpanded(false); setNewTitle(''); setNewDescription(''); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-2xl"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Tarefas */}
        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-gray-400 py-12">Nenhuma tarefa cadastrada.</p>}

          {tasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const isEditing = editingId === task.id;

            return (
              <li key={task.id} className="bg-slate-50 border border-gray-200 rounded-3xl overflow-hidden">
                {/* Cabeçalho */}
                <div className="flex items-center p-5">
                  <input
                    type="checkbox"
                    checked={task.status === 'concluido'}
                    onChange={() => toggleStatus(task)}
                    className="w-6 h-6 accent-blue-600 cursor-pointer"
                  />

                  <div className="ml-4 flex-1">
                    <h2 className={`text-lg font-semibold ${task.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">{task.status.replace('-', ' ')}</p>
                  </div>

                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="ml-2 px-4 py-1 text-gray-500 hover:text-gray-700 text-xl transition"
                  >
                    {isExpanded ? 'Resumir' : 'Detalhar'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-2xl transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Seção Expandida */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 bg-white">
                    {isEditing ? (
                      // Modo Edição
                      <div className="pt-4 space-y-4">
                        <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
                        <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full h-28 px-4 py-3 border rounded-2xl resize-none" />
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full px-4 py-3 border rounded-2xl">
                          <option value="pendente">Pendente</option>
                          <option value="em-andamento">Em andamento</option>
                          <option value="concluido">Concluída</option>
                        </select>

                        <div className="flex gap-3 pt-2">
                          <button onClick={() => saveEdit(task.id)} className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-medium">Salvar</button>
                          <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 py-3 rounded-2xl">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      // Visualização
                      <div className="pt-4 space-y-3 text-sm text-gray-600">
                        <p><strong>Descrição:</strong> {task.description || 'Sem descrição.'}</p>
                        <p><strong>Criada em:</strong> {new Date(task.created_at).toLocaleString('pt-BR')}</p>
                        {task.started_at && <p><strong>Iniciada em:</strong> {new Date(task.started_at).toLocaleString('pt-BR')}</p>}
                        {task.finished_at && (
                          <p className="text-green-600 font-medium">
                            <strong>Concluída em:</strong> {new Date(task.finished_at).toLocaleString('pt-BR')}
                          </p>
                        )}

                        <button
                          onClick={() => startEdit(task)}
                          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-medium transition"
                        >
                          Editar Tarefa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
=======

import AppRoutes from "./routes/AppRoutes";

function App() {
  // const [refresh, setRefresh] = useState(false);

  // function reload() {
  //   setRefresh(!refresh);
  // }
  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    //   <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
    //     <h1 className="text-3xl font-bold mb-4 text-center">
    //       Minhas tarefas
    //     </h1>
       
    //     <TaskForm onTaskCreated={reload} />
    //     <TaskList refresh={refresh} />
    //   </div>
    // </div>
    <AppRoutes />
  );
}

export default App;
>>>>>>> 469b5fb5a5d0f9591f36de8969ccee637f1fcc50
