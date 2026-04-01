import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from '../routes/AppRoutes';
import AuthContext from '../context/AuthContext';


export default function Login() {   
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContext.Provider value={{ user: null, login: async () => {}, logout: () => {}, isAuthenticated: false }}>
      <AppRoutes />
    </AuthContext.Provider>
  </StrictMode>
);
}