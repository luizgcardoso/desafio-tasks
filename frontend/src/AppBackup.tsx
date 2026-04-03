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
const USER_ID = 6; // ⚠️ Altere para o seu usuário

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isNewFormExpanded, setIsNewFormExpanded] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Filtros de Relatório
  const [reportType, setReportType] = useState<'all' | 'today' | 'week' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // ====================== CARREGAR TAREFAS ======================
  const fetchTasks = async () => {
  try {
    let url = `${API_BASE}/tasks/user/${USER_ID}`;

    if (reportType === 'today') {
      url = `${API_BASE}/tasks/user/${USER_ID}/today`;
    } else if (reportType === 'week') {
      url += '/last-week';
    } else if (reportType === 'custom' && startDate && endDate) {
      url += `/date-range?startDate=${startDate}&endDate=${endDate}`;
    } 
    // Filtros via query params (status + search)
    else if (statusFilter || search) {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao carregar tarefas');

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : data.tasks || []);
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o backend');
  }
};

  useEffect(() => {
    fetchTasks();
  }, [reportType, statusFilter, search]);

  useEffect(() => {
    if (reportType === 'custom' && startDate && endDate) {
      fetchTasks();
    }
  }, [startDate, endDate]);

  // ====================== ADICIONAR TAREFA ======================
  const handleAddTask = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      return alert('Título e descrição são obrigatórios');
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/create/${USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewDescription('');
        setIsNewFormExpanded(false);
        await fetchTasks();
      } else {
        alert('Erro ao criar tarefa');
      }
    } catch (err) {
      alert('Erro ao adicionar tarefa');
    }
  };

  // ====================== TOGGLE STATUS ======================
  const toggleStatus = async (task: Task) => {
    const statusOrder: Record<string, string> = {
      pendente: 'em-andamento',
      'em-andamento': 'concluido',
      concluido: 'pendente',
    };

    const newStatus = statusOrder[task.status] || 'pendente';
    let started_at = task.started_at;
    let finished_at = task.finished_at;

    if (newStatus === 'em-andamento' && !started_at) {
      started_at = new Date().toISOString();
    } else if (newStatus === 'concluido') {
      finished_at = new Date().toISOString();
    } else if (newStatus === 'pendente') {
      finished_at = null;
    }

    try {
      await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, description: task.description, status: newStatus, started_at, finished_at }),
      });
      await fetchTasks();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  // ====================== SALVAR EDIÇÃO ======================
  const saveEdit = async (id: number) => {
    const isCompleting = editStatus === 'concluido';
    const isProgressing = editStatus === 'em-andamento';
    const started_at = isProgressing ? new Date().toISOString() : null;
    const finished_at = isCompleting ? new Date().toISOString() : null;

    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription, status: editStatus, started_at, finished_at }),
      });
      await fetchTasks();
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
      await fetchTasks();
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

  // ====================== RELATÓRIOS ======================
const loadAll = () => {
    setReportType('all');
    setStatusFilter('');
    setSearch('');
    setStartDate('');
    setEndDate('');
  };
    const loadToday = () => setReportType('today');
  const loadLastWeek = () => setReportType('week');
  const loadCustom = () => setReportType('custom');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">To-Do List</h1>
        <h3 className="text-center text-lg font-semibold text-gray-600 mb-8">Gerencie suas tarefas</h3>

        {/* ==================== SEÇÃO DE RELATÓRIOS ==================== */}
        <div className="mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <h4 className="font-semibold text-gray-700 mb-4">Relatórios e Filtros</h4>

          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={loadAll}
              className="px-6 py-2.5 bg-white border border-gray-300 rounded-2xl hover:bg-gray-100 transition font-medium"
            >
              Todas as Tarefas
            </button>
            <button onClick={loadToday} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">Hoje</button>
            <button onClick={loadLastWeek} className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">Última Semana</button>
            <button onClick={loadCustom} className="px-6 py-2.5 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 transition">Período Customizado</button>
          </div>

          {reportType === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-2xl border">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data Inicial</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data Final</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 border rounded-2xl" />
              </div>
              <div className="flex items-end">
                <button onClick={fetchTasks} className="w-full bg-emerald-600 text-white py-3 rounded-2xl hover:bg-emerald-700">Aplicar Filtro</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl"
            />
            <button onClick={fetchTasks} className="bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700">
              Buscar
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-2xl"
            >
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="em-andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
        </div>

        {/* ==================== NOVA TAREFA ==================== */}
        <h2 className=" text-center text-xl font-bold text-gray-800 mb-4">Adicionar Nova Tarefa  </h2>
        <div className="mb-10 border border-gray-200 rounded-3xl overflow-hidden">
          <div className="flex items-center p-5 cursor-pointer hover:bg-gray-50" onClick={() => setIsNewFormExpanded(true)}>
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
                <button onClick={handleAddTask} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl">Adicionar Tarefa</button>
                <button onClick={() => { setIsNewFormExpanded(false); setNewTitle(''); setNewDescription(''); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-2xl">Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* ==================== LISTA DE TAREFAS ==================== */}
        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-gray-400 py-12">Nenhuma tarefa encontrada.</p>}

          {tasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const isEditing = editingId === task.id;

            return (
              <li key={task.id} className="bg-slate-50 border border-gray-200 rounded-3xl overflow-hidden">
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

                  <button onClick={() => toggleExpand(task.id)} className="ml-2 px-4 py-1 text-gray-500 hover:text-gray-700 text-xl transition">
                    {isExpanded ? '▲ Resumir' : '▼ Detalhar'}
                  </button>

                  <button onClick={() => deleteTask(task.id)} className="ml-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-2xl transition">
                    Delete
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 bg-white">
                    {isEditing ? (
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
                      <div className="pt-4 space-y-3 text-sm text-gray-600">
                        <p><strong>Descrição:</strong> {task.description || 'Sem descrição.'}</p>
                        <p><strong>Criada em:</strong> {new Date(task.created_at).toLocaleString('pt-BR')}</p>
                        {task.started_at && <p><strong>Iniciada em:</strong> {new Date(task.started_at).toLocaleString('pt-BR')}</p>}
                        {task.finished_at && <p className="text-green-600 font-medium"><strong>Concluída em:</strong> {new Date(task.finished_at).toLocaleString('pt-BR')}</p>}

                        <button onClick={() => startEdit(task)} className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-2xl font-medium transition">Editar Tarefa</button>
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