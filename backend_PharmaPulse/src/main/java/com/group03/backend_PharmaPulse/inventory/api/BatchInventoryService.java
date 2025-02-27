package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;
import com.group03.backend_PharmaPulse.inventory.internal.entity.BatchInventory;


import java.util.List;

public interface BatchInventoryService {
    List<BatchInventoryDTO> getAllBatchInventories();
    BatchInventoryDTO getBatchInventoryById(Long id);
    // New methods
    void deductInventory(Long productId, Integer quantity);
    void reserveInventory(Long productId, Integer quantity);
}
