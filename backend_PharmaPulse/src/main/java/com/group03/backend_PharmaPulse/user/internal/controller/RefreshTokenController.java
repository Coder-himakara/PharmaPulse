package com.group03.backend_PharmaPulse.user.internal.controller;

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

        refreshTokenService.verifyExpiration(refreshToken);
        String newAccessToken = jwtService.generateToken(refreshToken.getUser().toString());
        return new ResponseEntity<>(
                new StandardResponse(200,"Success",newAccessToken),
                HttpStatus.OK
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken") String refreshToken,
                                    HttpServletResponse response) {
        refreshTokenService.findByToken(refreshToken)
                .ifPresent(refreshTokenService::delete);

        // Clear cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }
}
