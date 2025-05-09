package com.group03.backend_PharmaPulse.user.internal.controller;

import com.group03.backend_PharmaPulse.user.api.exception.TokenExpiredException;
import com.group03.backend_PharmaPulse.user.internal.entity.RefreshToken;
import com.group03.backend_PharmaPulse.user.internal.serviceImpl.JWTService;
import com.group03.backend_PharmaPulse.user.internal.serviceImpl.RefreshTokenService;
import com.group03.backend_PharmaPulse.util.api.dto.StandardResponse;
import com.group03.backend_PharmaPulse.user.api.exception.TokenNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class RefreshTokenController {
    private final JWTService jwtService;
    private final RefreshTokenService refreshTokenService;

    public RefreshTokenController(JWTService jwtService, RefreshTokenService refreshTokenService) {
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }
    @PostMapping("/refresh")
    public ResponseEntity<StandardResponse> refreshToken(@CookieValue(name = "refreshToken") String requestRefreshToken) {
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new TokenNotFoundException("Refresh token not found"));
        try {
            // If the token is expired, verifyExpiration() throws TokenExpiredException
            refreshTokenService.verifyExpiration(refreshToken);
        } catch (TokenExpiredException e) {
            // Return 401 status so the frontend can redirect to the login page
            return new ResponseEntity<>(
                    new StandardResponse(401, "Refresh token expired, please login", null),
                    HttpStatus.UNAUTHORIZED
            );
        }
        // Token is valid; generate a new JWT token using the same refresh token
//        String newAccessToken = jwtService.generateToken(refreshToken.getUser().getUsername());
//        String role = refreshToken.getUser().getRole().toString();

        Map<String, String> data = new HashMap<>();
        data.put("newAccessToken", jwtService.generateToken(refreshToken.getUser().getUsername()));
        data.put("role", refreshToken.getUser().getRole().toString());
        return new ResponseEntity<>(
                new StandardResponse(200, "Success",data),
                HttpStatus.OK
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                    HttpServletResponse response) {
        try {
            // If token exists, try to delete it
            if (refreshToken != null && !refreshToken.isEmpty()) {
                refreshTokenService.findByToken(refreshToken)
                        .ifPresent(refreshTokenService::delete);
            }
            // Always clear the cookie, even if the token wasn't found
            ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.ok(new StandardResponse(200, "Logged out successfully", null));
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            // Return a more specific error message
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error during logout: " + e.getMessage(), null));
        }
    }
}
