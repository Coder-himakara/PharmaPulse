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
    public ResponseEntity<?> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                    HttpServletResponse response) {
        // If token exists, try to delete it
        if (refreshToken != null && !refreshToken.isEmpty()) {
            refreshTokenService.findByToken(refreshToken)
                    .ifPresent(refreshTokenService::delete);
        }

        // Always clear the cookie, even if the token wasn't found
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)  // Consider making this environment-dependent
                .path("/")     // Same path as when setting it
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new StandardResponse(200, "Logged out successfully", null));
    }
}
