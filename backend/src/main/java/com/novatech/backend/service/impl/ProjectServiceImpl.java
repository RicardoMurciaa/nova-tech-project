package com.novatech.backend.service.impl;

import com.novatech.backend.dto.ProjectDTO;
import com.novatech.backend.dto.ProjectResponseDTO;
import com.novatech.backend.dto.UserDTO; 
import com.novatech.backend.exception.ResourceNotFoundException;
import com.novatech.backend.model.Project;
import com.novatech.backend.model.User;
import com.novatech.backend.repository.ProjectRepository;
import com.novatech.backend.repository.UserRepository;
import com.novatech.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException; 
import org.springframework.security.core.userdetails.UsernameNotFoundException; 
import org.springframework.stereotype.Service;
import com.novatech.backend.service.FileStorageService; 
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository, 
                                UserRepository userRepository,
                                FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public ProjectResponseDTO createProject(ProjectDTO projectDTO, MultipartFile file, String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setManager(manager);
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            project.setFileName(fileName);
        }
        Project savedProject = projectRepository.save(project);
        return convertToResponseDTO(savedProject);
    }
    @Override
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectResponseDTO> getProjectsByManager(Long managerId) {
        return projectRepository.findByManagerId(managerId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDTO getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id: " + projectId));
        return convertToResponseDTO(project);
    }

    @Override
    public ProjectResponseDTO updateProject(Long projectId, ProjectDTO projectDTO, MultipartFile file, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (!project.getManager().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new AccessDeniedException("No tienes permiso para actualizar este proyecto.");
        }

        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        if (file != null && !file.isEmpty()) {
            if (project.getFileName() != null) {
                fileStorageService.deleteFile(project.getFileName());
            }
            String newFileName = fileStorageService.storeFile(file);
            project.setFileName(newFileName);
        }

        Project updatedProject = projectRepository.save(project);
        return convertToResponseDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado con id: " + projectId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + userEmail));

        if (!project.getManager().getId().equals(user.getId()) && !user.getRole().equals("ROLE_ADMIN")) {
            throw new AccessDeniedException("No tienes permiso para eliminar este proyecto.");
        }

        projectRepository.delete(project);
    }
    private ProjectResponseDTO convertToResponseDTO(Project project) {
        ProjectResponseDTO dto = new ProjectResponseDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setManager(convertToUserDTO(project.getManager())); 
        dto.setFileName(project.getFileName());
        return dto;
    }

    private UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setLastname(user.getLastname());
        userDTO.setEmail(user.getEmail());
        return userDTO;
    }
}