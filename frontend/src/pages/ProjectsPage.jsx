import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import Modal from '../components/Modal';
import './ProjectsPage.css';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectFile, setNewProjectFile] = useState(null); 
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFile, setEditFile] = useState(null); 
  const [editError, setEditError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdmin = currentUser && currentUser.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.data);
      setError('');
    } catch (err) {
      console.error("Error al cargar proyectos:", err);
      handleApiError(err, 'cargar');
    }
  };
  const handleFileChange = (e) => {
    setNewProjectFile(e.target.files[0]); 
  };

  const handleEditFileChange = (e) => {
    setEditFile(e.target.files[0]);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    if (!newProjectName) {
      setFormError('El nombre es obligatorio.');
      return;
    }
    const formData = new FormData();
    formData.append('name', newProjectName);
    formData.append('description', newProjectDescription);

    if (newProjectFile) {
      formData.append('file', newProjectFile);
    }

    try {
      await projectService.createProject(formData); 

      setSuccess('¡Proyecto creado con éxito!');
      setNewProjectName('');
      setNewProjectDescription('');
      setNewProjectFile(null); 
      document.getElementById('projectFile').value = null; 
      fetchProjects();
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      handleApiError(err, 'crear');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await projectService.deleteProject(projectId);
        setSuccess('Proyecto eliminado con éxito.');
        fetchProjects();
      } catch (err) {
        console.error("Error al eliminar proyecto:", err);
        handleApiError(err, 'eliminar');
      }
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setEditName(project.name);
    setEditDescription(project.description);
    setIsModalOpen(true);
    setEditError('');
    setEditFile(null); 
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editName) {
      setEditError('El nombre es obligatorio.');
      return;
    }

    const formData = new FormData();

    formData.append('name', editName);
    formData.append('description', editDescription);

    if (editFile) {
      formData.append('file', editFile);
    }

    try {
      await projectService.updateProject(currentProject.id, formData); 

      setSuccess('¡Proyecto actualizado con éxito!');
      closeEditModal();
      fetchProjects();
    } catch (err) {
      console.error("Error al actualizar proyecto:", err);
      if (err.response && err.response.status === 403) {
        setEditError('Acceso denegado. No tienes permiso para editar esto.');
      } else {
        setEditError('Error al actualizar el proyecto.');
      }
    }
  };
  const handleApiError = (err, action) => {
    let message = `Error al ${action} el proyecto.`;
    if (err.response) {
      if (err.response.status === 403) {
        message = `Acceso denegado. No tienes permiso para ${action} este proyecto.`;
      } else if (err.response.status === 401) {
        message = 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.';
      } else if (err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
    } else {
      message = 'Error de red o el servidor no responde.';
    }
    setError(message);
  };

  const searchTermLower = searchTerm.toLowerCase();
  
  const filteredProjects = projects.filter(project => {
    const nameMatch = project.name.toLowerCase().includes(searchTermLower);
    const managerFullName = `${project.manager.name} ${project.manager.lastname}`.toLowerCase();
    const managerMatch = managerFullName.includes(searchTermLower);
    return nameMatch || managerMatch;
  });

  return (
    <div className="projects-container">
      <h2>Gestión de Proyectos</h2>
      <div className="project-form">
        <h3>Crear Nuevo Proyecto</h3>
        {formError && <div className="error-message">{formError}</div>}
        <div className="form-group">
          <label htmlFor="projectName">Nombre del Proyecto</label>
          <input
            type="text"
            id="projectName"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectDesc">Descripción</label>
          <textarea
            id="projectDesc"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="projectFile">Adjuntar Archivo (Opcional)</label>
          <input
            type="file"
            id="projectFile"
            onChange={handleFileChange}
          />
        </div>
        
        <button onClick={handleCreateProject} className="btn btn-primary">Crear Proyecto</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <hr />
      <h3>Proyectos Existentes</h3>
      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="Buscar por nombre de proyecto o manager..." 
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="project-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => {
            const isManager = currentUser && project.manager.id === currentUser.id;
            const canEditOrDelete = isManager || isAdmin;
            return (
              <div key={project.id} className="project-card">
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                {project.fileName && (
                  <div className="file-attachment">
                    Archivo: <span>{project.fileName}</span>
                  </div>
                )}
                <small>Manager: {project.manager.name} {project.manager.lastname}</small>
                <div className="project-card-actions">
                  <button onClick={() => openEditModal(project)} className="btn btn-secondary" disabled={!canEditOrDelete}>Editar</button>
                  <button onClick={() => handleDeleteProject(project.id)} className="btn btn-danger" disabled={!canEditOrDelete}>Eliminar</button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay proyectos para mostrar.</p>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeEditModal}>
        <div className="modal-form">
          <h3>Editar Proyecto</h3>
          {editError && <div className="error-message">{editError}</div>}
          <div className="form-group">
            <label htmlFor="editProjectName">Nombre del Proyecto</label>
            <input
              type="text"
              id="editProjectName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editProjectDesc">Descripción</label>
            <textarea
              id="editProjectDesc"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="editProjectFile">Reemplazar Archivo (Opcional)</label>
            {currentProject && currentProject.fileName && !editFile && (
              <p>Actual: <span>{currentProject.fileName}</span></p>
            )}
            <input
              type="file"
              id="editProjectFile"
              onChange={handleEditFileChange}
            />
          </div>

          <button onClick={handleUpdateProject} className="btn btn-primary">Guardar Cambios</button>
        </div>
      </Modal>

    </div>
  );
}

export default ProjectsPage;