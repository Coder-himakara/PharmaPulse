package com.group03.backend_PharmaPulse.user.api;

import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface UsersService {
    UsersDTO registerUser(UsersDTO usersDTO, MultipartFile imageFile) throws IOException;
    Map<String, Object> verify(UserLoginDTO userLoginDTO);
}
