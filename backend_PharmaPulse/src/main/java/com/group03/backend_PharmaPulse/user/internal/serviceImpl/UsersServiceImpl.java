package com.group03.backend_PharmaPulse.user.internal.serviceImpl;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.user.api.dto.response.LoginSuccessResponse;
import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import com.group03.backend_PharmaPulse.user.internal.mapper.UsersMapper;
import com.group03.backend_PharmaPulse.user.internal.repository.UsersRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class UsersServiceImpl implements UsersService {
    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;
    private final UsersMapper usersMapper;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public UsersServiceImpl(UsersRepo usersRepo, PasswordEncoder passwordEncoder,
                            UsersMapper usersMapper, AuthenticationManager authenticationManager,
                            JWTService jwtService) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
        this.usersMapper = usersMapper;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public UsersDTO registerUser(UsersDTO usersDTO, MultipartFile imageFile) throws IOException {
        if (usersRepo.existsByUsername(usersDTO.getUsername())) {
            throw new IllegalArgumentException("User already exists");
        }
        usersDTO.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        // Handle image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                usersDTO.setImageName(imageFile.getOriginalFilename());
                usersDTO.setImageType(imageFile.getContentType());
                usersDTO.setImageData(imageFile.getBytes());
            } catch (IOException e) {
                throw new IOException("Error in saving image");
            }
        } else {
            // Set image fields to null when no image is provided
            usersDTO.setImageName(null);
            usersDTO.setImageType(null);
            usersDTO.setImageData(null);
        }
        Users registeredUser = usersRepo.save(usersMapper.toEntity(usersDTO));
        return usersMapper.toDTO(registeredUser);
    }

    @Override
    public Map<String, Object> verify(UserLoginDTO userLoginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginDTO.getUsername(), userLoginDTO.getPassword())
        );
        if (authentication.isAuthenticated()) {
            //Create user info
            LoginSuccessResponse loginSuccess = usersMapper.
                    toLoginSuccessResponse(usersRepo.findByUsername(userLoginDTO.getUsername()));
            //Create a JWT
            String token =jwtService.generateToken(userLoginDTO.getUsername());
            Map<String, Object> loginResultMap = new HashMap<>();
            loginResultMap.put("userInfo", loginSuccess);
            loginResultMap.put("token", token);
            return loginResultMap;
        }
        return null;
    }
}
