package com.group03.backend_PharmaPulse.inventory.api;

import com.group03.backend_PharmaPulse.inventory.api.dto.TruckInventoryDTO;

import java.util.List;

public interface TruckInventoryService {
    TruckInventoryDTO addOrUpdateTruckInventory(TruckInventoryDTO truckInventoryDTO);
    TruckInventoryDTO getTruckInventoryByBatchAndLocation(Long batchNumber, Long locationId);
}
