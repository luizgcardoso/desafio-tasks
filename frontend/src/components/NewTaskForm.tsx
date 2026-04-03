
interface NewTaskFormProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDescription: string;
  setNewDescription: (value: string) => void;
  isNewFormExpanded: boolean;
  setIsNewFormExpanded: (value: boolean) => void;
  onAddTask: () => void;
}

export default function NewTaskForm({
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  isNewFormExpanded,
  setIsNewFormExpanded,
  onAddTask,
}: NewTaskFormProps) {
  return (
    <div className="mb-10 border border-gray-200 rounded-3xl overflow-hidden">
      <div
        className="flex items-center p-5 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsNewFormExpanded(true)}
      >
        <input
          type="text"
          placeholder="Título da nova tarefa..."
          className="flex-1 bg-transparent focus:outline-none text-lg placeholder-gray-400"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onFocus={() => setIsNewFormExpanded(true)}
        />
      </div>

      {isNewFormExpanded && (
        <div className="px-5 pb-5 space-y-4">
          <textarea
            placeholder="Descrição detalhada..."
            className="w-full h-28 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={onAddTask} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl">Adicionar Tarefa</button>
            <button
              onClick={() => {
                setIsNewFormExpanded(false);
                setNewTitle('');
                setNewDescription('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-2xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}