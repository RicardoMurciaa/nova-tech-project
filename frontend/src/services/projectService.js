import api from './api'; 

const createProject = (formData) => {
  return api.post('/projects', formData);
};

const getAllProjects = () => {
  return api.get('/projects');
};

const updateProject = (id, formData) => {
  return api.put(`/projects/${id}`, formData);
};

const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

export default {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
};