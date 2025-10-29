package com.novatech.backend.service;

import java.util.List;
import com.novatech.backend.dto.UserDTO;

public interface UserService {

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();
}
