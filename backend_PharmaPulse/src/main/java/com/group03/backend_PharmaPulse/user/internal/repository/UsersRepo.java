package com.group03.backend_PharmaPulse.user.internal.repository;

import com.group03.backend_PharmaPulse.user.internal.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;


@Repository
@EnableJpaRepositories
public interface UsersRepo extends JpaRepository<Users,Long> {
    Users findByUsername(String username);
    boolean existsByUsername(String username);
}
