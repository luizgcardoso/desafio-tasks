import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import FiltersPanel from '../components/FiltersPanel';
import NewTaskForm from '../components/NewTaskForm';
import TaskItem from '../components/TaskItem';
import ConfirmModal from '../components/ConfirmModal';
import { useTaskData } from '../hooks/useTaskData';
import { useAuth } from '../context/AuthContext';

export default function TaskApp() {
  const { user } = useAuth();
  const { userId: paramUserId } = useParams<{ userId: string }>();
  const effectiveUserId = Number(paramUserId) || user?.id;

  const data = useTaskData(effectiveUserId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskTitleToDelete, setTaskTitleToDelete] = useState('');

  const openDeleteModal = (id: number, title: string) => {
    setTaskToDelete(id);
    setTaskTitleToDelete(title);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete || !taskTitleToDelete) return;
    await data.deleteTask(taskToDelete, taskTitleToDelete);
    setShowDeleteModal(false);
    setTaskToDelete(null);
    setTaskTitleToDelete('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500">
      <Header />

      <div className="p-8 max-w-4xl mx-auto">
        <FiltersPanel
          reportType={data.reportType}
          setReportType={data.setReportType}
          search={data.search}
          setSearch={data.setSearch}
          statusFilter={data.statusFilter}
          setStatusFilter={data.setStatusFilter}
          startDate={data.startDate}
          setStartDate={data.setStartDate}
          endDate={data.endDate}
          setEndDate={data.setEndDate}
          onClearFilters={data.clearFilters}
        />

        <NewTaskForm
          newTitle={data.newTitle}
          setNewTitle={data.setNewTitle}
          newDescription={data.newDescription}
          setNewDescription={data.setNewDescription}
          isNewFormExpanded={data.isNewFormExpanded}
          setIsNewFormExpanded={data.setIsNewFormExpanded}
          onAddTask={data.handleAddTask}
        />

        <ul className="space-y-4">
          {data.tasks.length === 0 && (
            <p className="text-center text-white py-12">Nenhuma tarefa encontrada.</p>
          )}

          {data.tasks.map((task) => {
            const isExpanded = data.expandedTasks.has(task.id);
            const isEditing = data.editingId === task.id;

            return (
              <TaskItem
                key={task.id}
                task={task}
                isExpanded={isExpanded}
                isEditing={isEditing}
                onToggleExpand={data.toggleExpand}
                onToggleStatus={data.toggleStatus}
                onDelete={(id) => openDeleteModal(id, task.title)}
                onStartEdit={data.startEdit}
                editTitle={data.editTitle}
                setEditTitle={data.setEditTitle}
                editDescription={data.editDescription}
                setEditDescription={data.setEditDescription}
                editStatus={data.editStatus}
                setEditStatus={data.setEditStatus}
                onSaveEdit={data.saveEdit}
                onCancelEdit={data.cancelEdit}
              />
            );
          })}
        </ul>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Excluir Tarefa"
        message={`Tem certeza que deseja excluir a tarefa:\n\n"${taskTitleToDelete}"?\n\nEsta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        isDanger={true}
      />

      {data.notification && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-xl z-50 flex items-center gap-3 transition-all duration-300 ${
            data.notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center text-xl">
            {data.notification.type === 'success' ? '✓' : '⚠'}
          </div>
          <p className="font-medium">{data.notification.message}</p>
        </div>
      )}
    </div>
  );
}