// 1. Importa nuestra instancia 'api' centralizada
import api from './api';

// 2. Nota que ya no definimos la URL completa, 
//    solo la parte final, porque la base '/api' ya está en 'api.js'

const login = (email, password) => {
  // 3. Usa 'api.post' en lugar de 'axios.post'
  return api.post('/auth/login', {
    email: email,
    password: password,
  });
};

const register = (name, lastname, email, password) => {
  return api.post('/auth/register', {
    name,
    lastname,
    email,
    password,
  });
};

export default {
  login,
  register,
};