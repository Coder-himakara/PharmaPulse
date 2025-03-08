package com.group03.backend_PharmaPulse.inventory.internal.repository;

import com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.InventoryLocation;
import com.group03.backend_PharmaPulse.inventory.internal.entity.WarehouseInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface WarehouseInventoryRepo extends JpaRepository<WarehouseInventory, Long> {
    // Existing method (if any)
    // Add a custom query to join warehouse_inventory and inventory
    @Query("SELECT new com.group03.backend_PharmaPulse.inventory.api.dto.WarehouseInventoryDTO(" +
            "wi.inventoryId, wi.location.locationId, wi.batch.batchId, wi.quantity, wi.warehouseLocation) " +
            "FROM WarehouseInventory wi")
    List<WarehouseInventoryDTO> findAllWarehouseInventoryDetails();
}