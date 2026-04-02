import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  startedDate?: Date;
  finishedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTasks(newExpanded);
  };

  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    const task: Task = {
      id: Date.now(),
      title: newTask.trim(),
      startedDate: new Date(),
      status: 'pending',
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleStatus = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id !== id) return task;

      let newStatus = task.status;
      let finishedDate = task.finishedDate;

      if (task.status === 'pending') {
        newStatus = 'in-progress';
      } else if (task.status === 'in-progress') {
        newStatus = 'completed';
        finishedDate = new Date();
      } else {
        newStatus = 'pending';
        finishedDate = undefined;
      }

      return {
        ...task,
        status: newStatus,
        finishedDate,
      };
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Desafio ToDo List
        </h1>

        {/* Input para nova tarefa */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Adicione uma nova tarefa..."
            className="flex-1 px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl transition"
          >
            Adicionar
          </button>
        </div>

        {/* Lista de tarefas */}
        <ul className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 py-8">Nenhuma tarefa ainda...</p>
          )}

          {tasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);

            return (
              <li
                key={task.id}
                className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden transition-all"
              >
                {/* Cabeçalho da tarefa (sempre visível) */}
                <div className="flex items-center p-4">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleStatus(task.id)}
                    className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />

                  <div className="ml-4 flex-1 min-w-0">
                    <h2
                      className={`text-lg font-semibold truncate ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {task.title}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {task.status.replace('-', ' ')}
                    </p>
                  </div>

                  {/* Botão expandir */}
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {isExpanded ? 'Recolher' : 'Expandir'}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-xl text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Detalhes expandidos */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 bg-white">
                    <div className="pt-4 space-y-3 text-sm text-gray-600">
                      <p>
                        <strong>Criada em:</strong>{' '}
                        {task.startedDate?.toLocaleString('pt-BR')}
                      </p>
                      {task.finishedDate && (
                        <p>
                          <strong>Concluída em:</strong>{' '}
                          {task.finishedDate.toLocaleString('pt-BR')}
                        </p>
                      )}
                      {task.status === 'in-progress' && (
                        <p className="text-amber-600 font-medium">
                          Tarefa em andamento...
                        </p>
                      )}
                    </div>
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