package com.group03.backend_PharmaPulse.sales.internal.repository;

import com.group03.backend_PharmaPulse.sales.internal.entity.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface CustomerGroupRepo extends JpaRepository<CustomerGroup, Integer> {
}
