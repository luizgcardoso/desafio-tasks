import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  status: string;
}

export const useTaskData = (userId: number | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isNewFormExpanded, setIsNewFormExpanded] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reportType, setReportType] = useState<'all' | 'today' | 'week' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (reportType === 'today') params.append('period', 'today');
      else if (reportType === 'week') params.append('period', 'last-week');
      else if (reportType === 'custom' && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else {
        if (statusFilter) params.append('status', statusFilter);
        if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
      }
      let url = `/tasks/user/${userId}`;
      const query = params.toString();
      if (query) url += `?${query}`;
      const response = await api.get(url);
      const data = response.data;
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err: any) {
      console.error('Erro ao buscar tarefas:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, reportType, statusFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      showNotification("O título da tarefa é obrigatório.", 'error');
      return;
    }
    try {
      await api.post(`/tasks/create/${userId}`, {
        title: newTitle.trim(),
        description: newDescription.trim(),
      });
      setNewTitle('');
      setNewDescription('');
      setIsNewFormExpanded(false);
      showNotification("Tarefa criada com sucesso!");
      fetchTasks();
    } catch (err) {
      showNotification("Erro ao criar tarefa.", 'error');
    }
  };

  const toggleStatus = async (task: Task) => {
    let newStatus = task.status;
    if (task.status === 'pendente') newStatus = 'em-andamento';
    else if (task.status === 'em-andamento') newStatus = 'concluido';
    else if (task.status === 'concluido') newStatus = 'pendente';
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      showNotification("Erro ao atualizar status.", 'error');
    }
  };

  const saveEdit = async (id: number) => {
    try {
      await api.put(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      setEditingId(null);
      showNotification("Tarefa atualizada com sucesso!");
      fetchTasks();
    } catch (err) {
      showNotification("Erro ao salvar edição.", 'error');
    }
  };

  const deleteTask = async (id: number, title: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      showNotification(`Tarefa "${title}" excluída com sucesso!`, 'success');
      fetchTasks();
    } catch (err) {
      showNotification("Erro ao excluir a tarefa.", 'error');
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

  const cancelEdit = () => setEditingId(null);

  const clearFilters = () => {
    setReportType('all');
    setSearch('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  return {
    tasks,
    loading,
    fetchTasks,
    newTitle, setNewTitle,
    newDescription, setNewDescription,
    isNewFormExpanded, setIsNewFormExpanded,
    handleAddTask,
    search, setSearch,
    statusFilter, setStatusFilter,
    reportType, setReportType,
    startDate, setStartDate,
    endDate, setEndDate,
    clearFilters,
    expandedTasks,
    editingId,
    editTitle, setEditTitle,
    editDescription, setEditDescription,
    editStatus, setEditStatus,
    toggleExpand,
    startEdit,
    saveEdit,
    toggleStatus,
    deleteTask,
    cancelEdit,
    notification,
    showNotification,
  };
};