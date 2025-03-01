package com.group03.backend_PharmaPulse.user.api;

import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;

import java.util.Map;

public interface UsersService {
    UsersDTO registerUser(UsersDTO usersDTO);
    Map<String, Object> verify(UserLoginDTO userLoginDTO);
}
