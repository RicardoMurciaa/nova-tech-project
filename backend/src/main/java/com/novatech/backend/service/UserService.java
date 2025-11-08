package com.novatech.backend.service;


import com.novatech.backend.dto.UserDTO;
import java.util.List;


import com.novatech.backend.dto.RegisterUserDTO;

public interface UserService {

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();
}
