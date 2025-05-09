package com.group03.backend_PharmaPulse.user.api.enumeration;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.group03.backend_PharmaPulse.user.api.enumeration.Permission.*;

@RequiredArgsConstructor
@Getter
public enum Role {
    ADMIN(
            Set.of(
                    ADMIN_CREATE,
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE
            )
    ),
    EMPLOYEE(
            Set.of(
                    EMPLOYEE_CREATE,
                    EMPLOYEE_READ,
                    EMPLOYEE_UPDATE,
                    EMPLOYEE_DELETE
            )
    ),
    SALES_REP(
            Set.of(
                    SALES_REP_CREATE,
                    SALES_REP_READ
            )
    )
    ;

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities= getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_"+ this.name()));
        return authorities;
    }
}
