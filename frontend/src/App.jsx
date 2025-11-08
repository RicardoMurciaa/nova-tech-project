import React from 'react';
// 1. Importa los componentes de enrutamiento
import { Routes, Route, Navigate } from 'react-router-dom';

// 2. Importa tus páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProtectedRoute from './components/ProtectedRouter';

function App() {
  return (
    <div className="App">
      {/* 3. Define el contenedor de rutas */}
      <Routes>
        {/* Ruta para el Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta para el Registro */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 4. Ruta por defecto */}
        {/* Si el usuario va a la raíz "/", redirígelo a "/login" */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route element={<ProtectedRoute />}>
          {/* Todas las rutas aquí dentro están protegidas */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />}/>
          {/* Si tuviéramos más rutas protegidas, irían aquí: */}
          {/* <Route path="/proyectos" element={<ProyectosPage />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;