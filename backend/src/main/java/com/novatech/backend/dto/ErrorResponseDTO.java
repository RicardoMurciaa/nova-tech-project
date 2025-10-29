package com.novatech.backend.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponseDTO {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
