// src/pages/TaskApp.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import FiltersPanel from '../components/FiltersPanel';
import NewTaskForm from '../components/NewTaskForm';
import TaskItem from '../components/TaskItem';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useTaskActions } from '../hooks/useTaskActions';

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
  const { user } = useAuth();
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const effectiveUserId = Number(paramUserId) || user?.id;

  // Hooks
  const filters = useTaskFilters();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estados locais
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isNewFormExpanded, setIsNewFormExpanded] = useState(false);

  // Estados do Modal de Confirmação
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskTitleToDelete, setTaskTitleToDelete] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ====================== BUSCAR TAREFAS ======================
  const fetchTasks = async () => {
    if (!effectiveUserId) return;

    try {
      let url = `/tasks/user/${effectiveUserId}`;

      if (filters.reportType === 'today') {
        url += '?period=today';
      } else if (filters.reportType === 'week') {
        url += '?period=last-week';
      } else if (filters.reportType === 'custom' && filters.startDate && filters.endDate) {
        url += `?startDate=${filters.startDate}&endDate=${filters.endDate}`;
      } else if (filters.statusFilter || filters.search.trim()) {
        const params = new URLSearchParams();
        if (filters.statusFilter) params.append('status', filters.statusFilter);
        if (filters.search.trim()) params.append('search', filters.search.trim());
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      const data = response.data;
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    }
  };

  // Atualiza quando filtros mudam
  useEffect(() => {
    fetchTasks();
  }, [
    filters.reportType,
    filters.statusFilter,
    filters.search,
    filters.startDate,
    filters.endDate,
    effectiveUserId,
  ]);

  // ====================== ACTIONS (usando o hook) ======================
  const actions = useTaskActions(effectiveUserId, fetchTasks);

  // ====================== ADICIONAR TAREFA ======================
  const handleAddTask = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      return alert('Título e descrição são obrigatórios');
    }

    try {
      await api.post(`/tasks/create/${effectiveUserId}`, {
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

  // ====================== DELETAR TAREFA ======================
  const openDeleteModal = (id: number, title: string) => {
    setTaskToDelete(id);
    setTaskTitleToDelete(title);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await api.delete(`/tasks/${taskToDelete}`);
      await fetchTasks();

      setNotification({
        message: `Tarefa "${taskTitleToDelete}" excluída com sucesso!`,
        type: 'success',
      });
    } catch (err) {
      setNotification({
        message: 'Erro ao excluir a tarefa. Tente novamente.',
        type: 'error',
      });
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
      setTaskTitleToDelete('');
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500">
      <Header />
      <div className="p-8 max-w-4xl mx-auto">
        <FiltersPanel
          reportType={filters.reportType}
          setReportType={filters.setReportType}
          search={filters.search}
          setSearch={filters.setSearch}
          statusFilter={filters.statusFilter}
          setStatusFilter={filters.setStatusFilter}
          startDate={filters.startDate}
          setStartDate={filters.setStartDate}
          endDate={filters.endDate}
          setEndDate={filters.setEndDate}
          onClearFilters={filters.clearFilters}
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
            const isExpanded = actions.expandedTasks.has(task.id);
            const isEditing = actions.editingId === task.id;

            return (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={isExpanded}
                isEditing={isEditing}
                onToggleExpand={actions.toggleExpand}
                onToggleStatus={actions.toggleStatus}
                onDelete={(id) => openDeleteModal(id, task.title)}
                onStartEdit={actions.startEdit}
                editTitle={actions.editTitle}
                setEditTitle={actions.setEditTitle}
                editDescription={actions.editDescription}
                setEditDescription={actions.setEditDescription}
                editStatus={actions.editStatus}
                setEditStatus={actions.setEditStatus}
                onSaveEdit={actions.saveEdit}
                onCancelEdit={actions.cancelEdit}
              />
            );
          })}
        </ul>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Excluir Tarefa"
        message={`Tem certeza que deseja excluir a tarefa:\n\n"${taskTitleToDelete}"?\n\nEsta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        isDanger={true}
      />

      {/* Notificação */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-lg z-50 transition-all duration-300 ${
            notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}