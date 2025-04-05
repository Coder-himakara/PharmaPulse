package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface InventoryLocationRepo extends JpaRepository<InventoryLocation, Long> {

    boolean existsByLocationName(String locationName);
    // Add method to find InventoryLocation by locationName
    Optional<InventoryLocation> findByLocationName(String locationName);
}
