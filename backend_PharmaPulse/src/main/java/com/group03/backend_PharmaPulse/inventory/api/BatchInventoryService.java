package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.BatchInventoryDTO;


import com.group03.backend_PharmaPulse.inventory.api.dto.ExpiryAlertDTO;
import com.group03.backend_PharmaPulse.inventory.api.dto.ReorderAlertDTO;



import java.util.List;

public interface BatchInventoryService {
    List<BatchInventoryDTO> getAllBatchInventories();
    BatchInventoryDTO getBatchInventoryById(Long id);

    /**
     * Checks for batches nearing expiry and generates alerts for 6 months, 3 months, 1 month, and 1 week before expiry.
     * Returns a list of BatchInventoryDTOs for batches needing alerts, grouped by threshold.
     */
    List<ExpiryAlertDTO> checkExpiryAlerts();

    /**
     * Checks for products needing reorder based on total available quantity across batches compared to reorderLimitByPackage.
     * Returns a list of BatchInventoryDTOs for batches of products requiring reorder alerts.
     */
    List<ReorderAlertDTO> checkReorderAlerts();

    // New methods
    void deductInventory(Long productId, Integer quantity);
    //void reserveInventory(Long productId, Integer quantity);
    // New method: Retrieve available batches for a product, sorted by expiry date ascending.
    List<BatchInventoryDTO> getBatchesByProductIdSorted(Long productId);


}
