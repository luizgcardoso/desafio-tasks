
import { useState } from 'react'
import './index.css'

interface Task {
  id: number;
  title: string;
  startedDate?: Date;
  finishedDate?: Date;
  status?: 'pending' | 'in-progress' | 'completed';
}

export default function App() {

const [tasks, setTasks] = useState<Task[]>([]);
const [newTask, setNewTask] = useState('');

const handleAddTask = () => {
  if (newTask.trim() === '') return;
  const task: Task = {
    id: Date.now(),
    title: newTask,
    startedDate: new Date(),
    status: 'pending',
  };
  setTasks([...tasks, task]);
  setNewTask('');
}


  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-emerald-400"> 
      <div className="bg-white shadow-lg rounded-3xl p-16">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Desafio ToDo List</h1>
        <div className="mb-4 flex">
          <input 
            type="text" 
            placeholder="Adicione uma nova tarefa..." 
            className="flex-grow px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
            {
              tasks.map(task => (
                <li key={task.id} className="fflex items-center p-3 rouded-lg bg-slate-100 border border-gray-200">
                  <input type="checkbox" 
                  checked={task.status === 'completed'} 
                  onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
                  }  className="mr-2 h-5 w-5 text-blue-600"/>
                  <span className={`line-through ${task.status === 'completed' ? 'text-gray-500' : 'text-gray-800'}`}>
                    {task.title}</span>
                  <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>
                  <p className="text-sm text-gray-600">Criada em: {task.startedDate?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Concluída em: {task.finishedDate?.toLocaleString()}</p>
                  <button className="ml-2 border-nonw p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white" onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>
                    Delete
                  </button>
                </li>
              ))
            }
        </ul>
      </div>
    </div>
     </>
  )
}

