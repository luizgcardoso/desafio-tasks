// src/components/NewTaskForm.tsx
import { useState } from 'react';

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
    <div className="mb-8 bg-white rounded-3xl shadow p-6">
      <button
        onClick={() => setIsNewFormExpanded(!isNewFormExpanded)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition"
      >
        {isNewFormExpanded ? 'Fechar Formulário' : '➕ Nova Tarefa'}
      </button>

      {isNewFormExpanded && (
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Título da tarefa"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Descrição da tarefa (opcional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-y"
          />

          <button
            onClick={onAddTask}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold transition"
          >
            Criar Tarefa
          </button>
        </div>
      )}
    </div>
  );
}