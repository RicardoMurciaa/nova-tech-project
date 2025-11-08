package com.novatech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private UserDTO userDetails;

    public AuthResponseDTO(String token){
        this.token = token;
    }

    public AuthResponseDTO(String token, UserDTO userDetails) {
        this.token = token;
        this.userDetails = userDetails;
    }
}
