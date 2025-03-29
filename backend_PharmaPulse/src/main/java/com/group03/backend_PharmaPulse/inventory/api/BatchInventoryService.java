package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;



import java.util.List;

public interface BatchInventoryService {
    List<BatchInventoryDTO> getAllBatchInventories();
    BatchInventoryDTO getBatchInventoryById(Long id);
    // New methods
    void deductInventory(Long productId, Integer quantity);
    //void reserveInventory(Long productId, Integer quantity);
    // New method: Retrieve available batches for a product, sorted by expiry date ascending.
    List<BatchInventoryDTO> getBatchesByProductIdSorted(Long productId);

}
