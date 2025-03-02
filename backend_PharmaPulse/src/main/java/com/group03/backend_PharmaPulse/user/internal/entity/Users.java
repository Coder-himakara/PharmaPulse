package com.group03.backend_PharmaPulse.user.internal.entity;

import com.group03.backend_PharmaPulse.user.api.enumeration.Role;
import com.group03.backend_PharmaPulse.user.api.enumeration.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    private String nicNumber;
    private String email;
    private String address;
    private String contactNumber;
    private LocalDate dateOfJoined;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    private String username;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}
