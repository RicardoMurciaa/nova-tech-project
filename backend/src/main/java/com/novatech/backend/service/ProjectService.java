package com.novatech.backend.service;

import com.novatech.backend.dto.ProjectDTO;
import com.novatech.backend.dto.ProjectResponseDTO;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ProjectService {

    ProjectResponseDTO createProject(ProjectDTO projectDTO, MultipartFile file, String managerEmail);
    List<ProjectResponseDTO> getAllProjects();

    List<ProjectResponseDTO> getProjectsByManager(Long managerId);
    
    ProjectResponseDTO getProjectById(Long projectId);

    ProjectResponseDTO updateProject(Long projectId, ProjectDTO projectDTO, MultipartFile file, String userEmail);
    void deleteProject(Long projectId, String userEmail);
}