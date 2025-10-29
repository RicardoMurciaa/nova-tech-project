import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService'; 
import './LoginPage.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await authService.login(email, password);
      console.log('¡Login Exitoso!', response.data);
      
      localStorage.setItem('token', response.data.token);

      navigate('/dashboard'); 
      
    } catch (err) {
      console.error('Error en el login:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      } else {
        setError('Ocurrió un error. Por favor, contacta al administrador.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          Ingresar
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aqui</Link>
        </p>

        {/* Mostramos el mensaje de error solo si existe */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;