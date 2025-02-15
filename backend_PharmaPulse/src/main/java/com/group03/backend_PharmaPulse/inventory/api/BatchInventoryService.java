package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;

import java.util.List;

public interface BatchInventoryService {
    BatchInventoryDTO addBatchInventory (BatchInventoryDTO batchInventoryDTO);
    List<BatchInventoryDTO> addBatchInventoryList(List<BatchInventoryDTO> batchInventoryList);
    List<BatchInventoryDTO> getAllBatchInventories();
    BatchInventoryDTO getBatchInventoryById(Long id);
}
