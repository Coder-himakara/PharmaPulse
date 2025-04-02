package com.group03.backend_PharmaPulse.user.internal.serviceImpl;

import com.group03.backend_PharmaPulse.user.api.UsersService;
import com.group03.backend_PharmaPulse.user.api.dto.UserLoginDTO;
import com.group03.backend_PharmaPulse.user.api.dto.UsersDTO;
import com.group03.backend_PharmaPulse.user.api.dto.response.LoginSuccessResponse;
import com.group03.backend_PharmaPulse.user.internal.entity.RefreshToken;
import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import com.group03.backend_PharmaPulse.user.internal.mapper.UsersMapper;
import com.group03.backend_PharmaPulse.user.internal.repository.UsersRepo;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class UsersServiceImpl implements UsersService {
    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;
    private final UsersMapper usersMapper;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    public UsersServiceImpl(UsersRepo usersRepo, PasswordEncoder passwordEncoder,
                            UsersMapper usersMapper, AuthenticationManager authenticationManager,
                            JWTService jwtService, RefreshTokenService refreshTokenService) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
        this.usersMapper = usersMapper;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public UsersDTO registerUser(UsersDTO usersDTO, MultipartFile imageFile) throws IOException {
        if (usersRepo.existsByUsername(usersDTO.getUsername())) {
            throw new IllegalArgumentException("User already exists");
        }
        usersDTO.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        // Handle image processing with defensive checks
        try {
            if (imageFile != null && !imageFile.isEmpty() && imageFile.getSize() > 0) {
                usersDTO.setImageName(imageFile.getOriginalFilename());
                usersDTO.setImageType(imageFile.getContentType());
                usersDTO.setImageData(imageFile.getBytes());
            } else {
                // Set image fields to null when no image is provided
                usersDTO.setImageName(null);
                usersDTO.setImageType(null);
                usersDTO.setImageData(null);
            }
        } catch (IOException e) {
            // Log the error
            System.err.println("Error processing image file: " + e.getMessage());
            // Default to null values for image fields
            usersDTO.setImageName(null);
            usersDTO.setImageType(null);
            usersDTO.setImageData(null);
            throw new IOException("Error in saving image"+e.getMessage());
        }
        Users registeredUser = usersRepo.save(usersMapper.toEntity(usersDTO));
        return usersMapper.toDTO(registeredUser);
    }

    @Transactional
    @Override
    public Map<String, Object> verify(UserLoginDTO userLoginDTO, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginDTO.getUsername(), userLoginDTO.getPassword())
        );
        if (authentication.isAuthenticated()) {
            //Create user info
            LoginSuccessResponse loginSuccess = usersMapper.
                    toLoginSuccessResponse(usersRepo.findByUsername(userLoginDTO.getUsername()));
            //Create a JWT
            String token =jwtService.generateToken(userLoginDTO.getUsername());
            //Create a refresh token
            RefreshToken refreshToken = refreshTokenService.findByTokenForUser(userLoginDTO.getUsername())
                    .filter(rt -> rt.getExpiryDate().isAfter(Instant.now()))
                    .orElseGet(() -> refreshTokenService.generateRefreshToken(userLoginDTO.getUsername()));

            // Set refresh token in cookie
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(refreshTokenService.getRefreshExpirationMs() / 1000)
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            Map<String, Object> loginResultMap = new HashMap<>();
            loginResultMap.put("userInfo", loginSuccess);
            loginResultMap.put("token", token);
            return loginResultMap;
        }
        return null;
    }
}
