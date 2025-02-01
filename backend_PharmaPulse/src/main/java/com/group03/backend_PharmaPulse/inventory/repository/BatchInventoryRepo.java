package com.group03.backend_PharmaPulse.inventory.repository;

import com.group03.backend_PharmaPulse.inventory.entity.BatchInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface BatchInventoryRepo extends JpaRepository<BatchInventory, Long> {
}
