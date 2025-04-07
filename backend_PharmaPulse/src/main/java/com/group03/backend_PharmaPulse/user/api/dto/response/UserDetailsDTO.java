package com.group03.backend_PharmaPulse.user.api.dto.response;

import com.group03.backend_PharmaPulse.user.api.enumeration.Role;
import com.group03.backend_PharmaPulse.user.api.enumeration.UserStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailsDTO {
    private Long userId;
    private String nicNumber;
    private String email;
    private String address;
    private String contactNumber;
    private LocalDate dateOfJoined;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    private String username;

    @Enumerated(EnumType.STRING)
    private Role role;
}
