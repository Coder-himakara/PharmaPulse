package com.group03.backend_PharmaPulse.user.api;

import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.user.api.dto.response.UserDetailsDTO;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface UsersService {
    UsersDTO registerUser(UsersDTO usersDTO, MultipartFile imageFile) throws IOException;
    Map<String, Object> verify(UserLoginDTO userLoginDTO, HttpServletResponse response);
    List<UserDetailsDTO> getUserDetails();
    UsersDTO updateUser(Long id, UsersDTO usersDTO, MultipartFile imageFile) throws IOException;;
}
