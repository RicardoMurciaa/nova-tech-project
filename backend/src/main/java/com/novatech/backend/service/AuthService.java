package com.novatech.backend.service;

import com.novatech.backend.dto.AuthResponseDTO;
import com.novatech.backend.dto.LoginDTO;
import com.novatech.backend.dto.RegisterUserDTO;
import com.novatech.backend.dto.UserDTO;

public interface AuthService {
    UserDTO registerUser(RegisterUserDTO registerUserDTO);
    AuthResponseDTO login(LoginDTO loginDTO);
}
