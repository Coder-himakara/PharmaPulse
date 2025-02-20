package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;

import java.util.List;

public interface BatchInventoryService {
    List<BatchInventoryDTO> getAllBatchInventories();
    BatchInventoryDTO getBatchInventoryById(Long id);
}
