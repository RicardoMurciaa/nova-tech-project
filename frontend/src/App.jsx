import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; 

import ProtectedRoute from './components/ProtectedRouter'; 

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Ruta por Defecto --- */}
        <Route path="/" element={<Navigate replace to="/login" />} />

        {/* --- ¡NUEVA RUTA PROTEGIDA! --- */}
        {/* Esta ruta usa 'element' para definir al "guardia".
          Cualquier componente "hijo" anidado dentro de esta ruta
          será renderizado por el <Outlet /> del guardia.
        */}
        <Route element={<ProtectedRoute />}>
          {/* Todas las rutas aquí dentro están protegidas */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Si tuviéramos más rutas protegidas, irían aquí: */}
          {/* <Route path="/proyectos" element={<ProyectosPage />} /> */}
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;