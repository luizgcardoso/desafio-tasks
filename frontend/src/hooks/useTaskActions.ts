// src/hooks/useTaskActions.ts
import { useState } from 'react';
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

export const useTaskActions = (userId: number | undefined, fetchTasks: () => Promise<void>) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedTasks);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedTasks(newSet);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

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

  return {
    expandedTasks,
    editingId,
    editTitle,
    editDescription,
    editStatus,
    toggleExpand,
    startEdit,
    saveEdit,
    toggleStatus,
    setEditTitle,
    setEditDescription,
    setEditStatus,
    cancelEdit,           // ← Adicionado aqui
  };
};