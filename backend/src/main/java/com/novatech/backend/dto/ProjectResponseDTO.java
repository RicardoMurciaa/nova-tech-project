package com.novatech.backend.dto;

import lombok.Data;

@Data
public class ProjectResponseDTO {

    private Long id;
    private String name;
    private String description;
    private UserDTO manager;
    private String fileName;
}