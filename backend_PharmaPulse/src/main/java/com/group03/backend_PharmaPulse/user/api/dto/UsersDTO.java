package com.group03.backend_PharmaPulse.user.api.dto;

import com.group03.backend_PharmaPulse.user.api.enumeration.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDTO {
    //private Long id;
    private String username;
    private String password;
    private Role role;
}
