import api from './api';

const getAllUsers = () => {
  return api.get('/users');
};

export default {
  getAllUsers,
};