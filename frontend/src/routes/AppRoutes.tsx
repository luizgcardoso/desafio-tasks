// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import PrivateRoute from '../components/PrivateRoute';
import TaskApp from '../pages/TaskApp';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TaskApp />
          </PrivateRoute>
        }
      />

      {/* Redireciona qualquer rota inválida para login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}