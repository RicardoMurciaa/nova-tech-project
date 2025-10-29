import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService'; 

function DashboardPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        
        if (err.response) {
          if (err.response.status === 403) {
            setError('Acceso denegado. No tienes permisos de administrador.');
          } else if (err.response.status === 401) {
            setError('Tu sesión ha expirado. Por favor, cierra sesión y vuelve a entrar.');
          } else {
            setError('Error al cargar los datos.');
          }
        } else {
          setError('Error de red o el servidor no responde.');
        }
      }
    };

    fetchUsers(); 
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: '800px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard de NovaTech</h2>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#d9534f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            height: 'fit-content'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <p>Esta es una página protegida.</p>
      
      <hr style={{ margin: '1.5rem 0' }} />

      <h3>Lista de Empleados del Sistema</h3>
      
      {/* 8. Lógica de renderizado */}
      
      {/* Si hay un error, muestra el error */}
      {error && (
        <div style={{ color: '#d9534f', backgroundColor: '#f2dede', padding: '1rem', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Si no hay error y hay usuarios, muestra la lista */}
      {!error && users.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li key={user.id} style={{ background: '#f9f9f9', border: '1px solid #eee', padding: '0.75rem', marginBottom: '0.5rem', borderRadius: '4px' }}>
              <strong>Nombre:</strong> {user.name} {user.lastname} <br />
              <strong>Email:</strong> {user.email}
            </li>
          ))}
        </ul>
      )}
      
      {/* Si no hay error y no hay usuarios (o están cargando) */}
      {!error && users.length === 0 && (
        <p>Cargando usuarios...</p>
      )}

    </div>
  );
}

export default DashboardPage;