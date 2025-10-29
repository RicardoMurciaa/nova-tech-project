import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService'; 
import './LoginPage.css'; 

function RegisterPage() {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await authService.register(name, lastname, email, password);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setName('');
      setLastname('');
      setEmail('');
      setPassword('');

    } catch (err) {
      
      console.error('Error en el registro:', err);

      if (err.response && err.response.data) {
        
        if (typeof err.response.data === 'object') {
          const validationErrors = Object.values(err.response.data).join(', ');
          setError(validationErrors);
        } else {
          setError(err.response.data.message || 'Ocurrió un error en el registro.');
        }
      } else {
        setError('Error de red o el servidor no responde.');
      }
    }
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>

        {/* --- Nuevos Campos --- */}
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Apellido</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </div>

        {/* --- Campos existentes --- */}
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
            minLength="8" 
            required
          />
        </div>

        <button type="submit" className="login-button">
          Registrarse
        </button>

        {/*Nuevo enlace*/}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión aqui</Link>
        </p>

        {/* Mostramos el mensaje de error si existe */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Mostramos el mensaje de éxito si existe */}
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}

export default RegisterPage;