package com.group03.backend_PharmaPulse.user.internal.serviceImpl;

import com.group03.backend_PharmaPulse.user.internal.entity.RefreshToken;
import com.group03.backend_PharmaPulse.user.internal.repository.RefreshTokenRepo;
import com.group03.backend_PharmaPulse.user.internal.repository.UsersRepo;
import com.group03.backend_PharmaPulse.user.api.exception.TokenExpiredException;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepo refreshTokenRepo;
    private final UsersRepo usersRepo;
    @Getter
    private final Long refreshExpirationMs = 1000 * 60 * 60 * 24 * 7L; // 7 days

    public RefreshTokenService(RefreshTokenRepo refreshTokenRepo, UsersRepo usersRepo) {
        this.refreshTokenRepo = refreshTokenRepo;
        this.usersRepo = usersRepo;
    }
    public RefreshToken generateRefreshToken(String username) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(usersRepo.findByUsername(username))
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        return refreshTokenRepo.save(refreshToken);
    }

    // Verify refresh token validity
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepo.delete(token);
            throw new TokenExpiredException("Refresh token was expired");
        }
        return token;
    }
    public void deleteByUserId(Long userId) {
        refreshTokenRepo.deleteByUser(usersRepo.findById(userId).get());
    }
    // Find token in database
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }
    public void delete(RefreshToken refreshToken) {
        refreshTokenRepo.delete(refreshToken);
    }
}
