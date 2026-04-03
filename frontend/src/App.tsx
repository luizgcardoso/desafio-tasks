import { useState, useEffect } from 'react';
import FiltersPanel from './components/FiltersPanel';
import NewTaskForm from './components/NewTaskForm';
import TaskItem from './components/TaskItem';

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
const USER_ID = 6;

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

  const fetchTasks = async () => {
    try {
      let url = `${API_BASE}/tasks/user/${USER_ID}`;

      if (reportType === 'today') {
        url += '?period=today';
      } else if (reportType === 'week') {
        url += '?period=last-week';
      } else if (reportType === 'custom' && startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else if (statusFilter || search.trim()) {
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

  // ====================== FUNÇÕES ======================
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

  const toggleStatus = async (task: Task) => {
    const statusOrder: Record<string, string> = {
      pendente: 'em-andamento',
      'em-andamento': 'concluido',
      concluido: 'pendente',
    };

    const newStatus = statusOrder[task.status] || 'pendente';
    let started_at = task.started_at;
    let finished_at = task.finished_at;

    if (newStatus === 'em-andamento' && !started_at) started_at = new Date().toISOString();
    else if (newStatus === 'concluido') finished_at = new Date().toISOString();
    else if (newStatus === 'pendente') finished_at = null;

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

        <FiltersPanel
          reportType={reportType}
          setReportType={setReportType}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onApplyFilter={fetchTasks}
        />

        <NewTaskForm
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
          isNewFormExpanded={isNewFormExpanded}
          setIsNewFormExpanded={setIsNewFormExpanded}
          onAddTask={handleAddTask}
        />

        <ul className="space-y-4">
          {tasks.length === 0 && <p className="text-center text-gray-400 py-12">Nenhuma tarefa encontrada.</p>}

          {tasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const isEditing = editingId === task.id;

            return (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={isExpanded}
                isEditing={isEditing}
                onToggleExpand={toggleExpand}
                onToggleStatus={toggleStatus}
                onDelete={deleteTask}
                onStartEdit={startEdit}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editDescription={editDescription}
                setEditDescription={setEditDescription}
                editStatus={editStatus}
                setEditStatus={setEditStatus}
                onSaveEdit={saveEdit}
                onCancelEdit={() => setEditingId(null)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
} 