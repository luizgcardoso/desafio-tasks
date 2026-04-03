interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  status: string;
}

interface TaskItemProps {
  task: Task;
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: (id: number) => void;
  onToggleStatus: (task: Task) => void;
  onDelete: (id: number, title: string) => void;
  onStartEdit: (task: Task) => void;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editDescription: string;
  setEditDescription: (value: string) => void;
  editStatus: string;
  setEditStatus: (value: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
}

export default function TaskItem({
  task,
  isExpanded,
  isEditing,
  onToggleExpand,
  onToggleStatus,
  onDelete,
  onStartEdit,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editStatus,
  setEditStatus,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) {
  return (
    <li className="bg-slate-50 border border-gray-200 rounded-3xl overflow-hidden">
      <div className="flex items-center p-5">
        <input
          type="checkbox"
          checked={task.status === 'concluido'}
          onChange={() => onToggleStatus(task)}
          className="w-6 h-6 accent-blue-600 cursor-pointer"
        />
        <div className="ml-4 flex-1">
          <h2 className={`text-lg font-semibold ${task.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h2>
          <p className="text-sm text-gray-500 capitalize">{task.status.replace('-', ' ')}</p>
        </div>
        <button
          onClick={() => onToggleExpand(task.id)}
          className="ml-2 px-4 py-1 text-gray-500 hover:text-gray-700 text-xl transition"
        >
          {isExpanded ? '▲ Resumir' : '▼ Detalhar'}
        </button>
        <button
          onClick={() => onDelete(task.id, task.title)}
          className="ml-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-2xl transition"
        >
          Excluir
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 bg-white">
          {isEditing ? (
            <div className="pt-4 space-y-4">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título da tarefa"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full h-28 px-4 py-3 border border-gray-300 rounded-2xl resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição da tarefa"
              />
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pendente">Pendente</option>
                <option value="em-andamento">Em andamento</option>
                <option value="concluido">Concluída</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onSaveEdit(task.id)}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl font-medium hover:bg-emerald-700 transition"
                >
                  Salvar
                </button>
                <button
                  onClick={onCancelEdit}
                  className="flex-1 bg-gray-200 py-3 rounded-2xl font-medium hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 space-y-3 text-sm text-gray-600">
              <p><strong>Descrição:</strong> {task.description || 'Sem descrição.'}</p>
              <p><strong>Criada em:</strong> {new Date(task.created_at).toLocaleString('pt-BR')}</p>
              {task.started_at && (
                <p><strong>Iniciada em:</strong> {new Date(task.started_at).toLocaleString('pt-BR')}</p>
              )}
              {task.finished_at && (
                <p className="text-green-600 font-medium">
                  <strong>Concluída em:</strong> {new Date(task.finished_at).toLocaleString('pt-BR')}
                </p>
              )}
              <button
                onClick={() => onStartEdit(task)}
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
}