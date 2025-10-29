import api from './api';

const login = (email, password) => {

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