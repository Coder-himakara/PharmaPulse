package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface InventoryRepo extends JpaRepository<Inventory, Long> {

}
