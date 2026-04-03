// src/pages/TaskApp.tsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FiltersPanel from '../components/FiltersPanel';
import NewTaskForm from '../components/NewTaskForm';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';   // ← Usando axios com interceptor

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  status: string;
}

export default function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isNewFormExpanded, setIsNewFormExpanded] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reportType, setReportType] = useState<'all' | 'today' | 'week' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const { user } = useAuth();   // ← Pegamos o user do contexto

  // ====================== BUSCAR TAREFAS ======================
  const fetchTasks = async () => {
    if (!user?.id) return;

    try {
      let url = `/tasks/user/${user.id}`;

      if (reportType === 'today') url += '?period=today';
      else if (reportType === 'week') url += '?period=last-week';
      else if (reportType === 'custom' && startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      } else if (statusFilter || search.trim()) {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (search.trim()) params.append('search', search.trim());
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      const data = response.data;

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [reportType, statusFilter, search, user?.id]);

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
      await api.post(`/tasks/create/${user?.id}`, {
        title: newTitle.trim(),
        description: newDescription.trim(),
      });

      setNewTitle('');
      setNewDescription('');
      setIsNewFormExpanded(false);
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar tarefa');
    }
  };

  // ====================== MUDAR STATUS ======================
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
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        started_at,
        finished_at,
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

    const started_at = isProgressing ? new Date().toISOString() : undefined;
    const finished_at = isCompleting ? new Date().toISOString() : undefined;

    try {
      await api.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        started_at,
        finished_at,
      });
      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      alert('Erro ao salvar edição');
    }
  };

  // ====================== DELETAR ======================
  const deleteTask = async (id: number) => {
    if (!confirm('Excluir esta tarefa?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      alert('Erro ao deletar tarefa');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500">
      <Header />
      <div className="p-8 max-w-4xl mx-auto">
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
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 py-12">Nenhuma tarefa encontrada.</p>
          )}

          {tasks.map((task) => {
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